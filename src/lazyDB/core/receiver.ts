import {
   EventReducersMap,
   ModelEvent,
   ModelEventPayload,
   IProducerStore,
   ModelAttributeType,
   EventReducer,
} from './types'
import { share, tap} from 'rxjs/operators'
import { StateMemory} from './memory'
import { pushToParentIfCan} from '@/lazyDB/core/toParent'

export const unsubscribeStore = ({ subscription}: IProducerStore) =>
   subscription && subscription.unsubscribe()

export function receive(
   store: IProducerStore,
   subscriber: (event: ModelEvent<ModelEventPayload | undefined>) => void | Promise<void>,
) {
   unsubscribeStore(store)

   const { dispatcher} = store

   store.subscription = dispatcher.eventsSubject
      .subscribe(subscriber)
}

export function atomicReceiveByReducers(store: IProducerStore, reducers: EventReducersMap) {
   store.reducers = reducers

   receive(store, (event) => {
      const reducer = getReducer(event)
      if (!reducer)
         return

      handleByReducer(event, reducer)
   })
}

export function asyncReceiveByReducers(store: IProducerStore, reducers: EventReducersMap) {
   store.reducers = reducers

   receive(store, async (event) => {
      const reducer = getReducer(event)
      if (!reducer)
         return

      handleByReducer(event, reducer)
   })
}

// TODO: refactor, may be this must be event handler
export function atomicReceiveWithMemory(store: IProducerStore, reducers: EventReducersMap) {

   store.memory = new StateMemory<ModelEvent<any>>()
   store.reducers = reducers

   // Trying handle event by reducers in storage
   // If event not handled (handler return false) and storage have memory
   // event adding to storage memory
   receive(store, (event) => {
      const { payload} = event
      if (!payload) {
         console.error('Not have payload on event:', event)
         throw new Error('Not have event payload')
      }

      const { store} = payload

      const reducer = getReducer(event)
      if (!reducer)
         return

      const handleResult = handleByReducer(event, reducer)

      sync(handleResult)
         .then((isHandled) => {
            if (isHandled || !store.memory)
               return

            store.memory.push(event)
         })
   })
}

// TODO: rewrite, code must write without this strange behavior
function sync<T>(value: T | PromiseLike<T>): PromiseLike<T> {
   if (isPromise(value))
      return value

   return {
      then(handler: (value: T) => any) {
         handler(value)
      },
   } as PromiseLike<T>
}

export function asyncReceiveWithMemory(store: IProducerStore, reducers: EventReducersMap, prop?: PropertyKey, type?: ModelAttributeType) {
   unsubscribeStore(store)

   const { dispatcher} = store

   store.memory = new StateMemory<ModelEvent<any>>()
   store.reducers = reducers

   // Trying handle event by reducers in storage
   // If event handled (handler return true) and storage have memory
   // event would remove from storage memory
   store.stream = dispatcher.eventsSubject
      .pipe(
         tap(saveInMemoryIfCan),
         share(),
      )

   store.subscription = store.stream!.subscribe(async (event) => {
      const reducer = getReducer(event)
      if (!reducer) {
         if (prop)
            pushToParentIfCan(store, prop, event, type)
         else
            console.warn('Not have handler for event', event)
         return
      }

      const handlerResult = handleByReducer(event, reducer)
      const isHandled = await sync(handlerResult)

      if (!isHandled || !store.memory)
         return

      store.memory.remove(event)
   })
}

function saveInMemoryIfCan<Payload extends ModelEventPayload = ModelEventPayload>(event: ModelEvent<Payload | undefined>) {
   const store = getStoreFromEvent(event)

   console.log('save in memory', event, store.memory)
   if (!store.memory)
      return

   store.memory.push(event)
}

const isPromise = (value: any): value is PromiseLike<any> =>
   typeof value === 'object' && value.then

function getStoreFromEvent(event: ModelEvent<any>): IProducerStore {
   const { payload} = event
   // TODO: remove when store will be outside from payload
   if (!payload) {
      console.error('Not have payload on event:', event)
      throw new Error('Not have event payload')
   }

   return payload.store
}

function getReducer(event: ModelEvent<any>): EventReducer<any> | undefined {
   const store = getStoreFromEvent(event)

   if (!store.reducers)
      return

   return store.reducers[event.type]
}

function handleByReducer(event: ModelEvent<any>, reducer: EventReducer<any>): boolean | Promise<boolean | void | undefined> {
   const store = getStoreFromEvent(event)

   const result = reducer(store, event.payload)
   if (isPromise(result))
      return result

   return !!result
}
