import {EventReducersMap, ModelEvent, ModelEventPayload, IProducerStore} from './types'
import {share, tap} from 'rxjs/operators'
import {StateMemory} from './memory'

export function receive(
   store: IProducerStore,
   subscriber: (event: ModelEvent<ModelEventPayload | undefined>) => void | Promise<void>,
) {
   const {dispatcher, subscription} = store

   if (subscription) {
      subscription.unsubscribe()
   }

   store.subscription = dispatcher.eventsSubject
      .subscribe(subscriber)
}

export function atomicReceiveByReducers(store: IProducerStore, reducers: EventReducersMap) {
   store.reducers = reducers

   receive(store, (event) => {
      handleEventByReducer(event)
   })
}

export function asyncReceiveByReducers(store: IProducerStore, reducers: EventReducersMap) {
   store.reducers = reducers

   receive(store, async (event) => {
      handleEventByReducer(event)
   })
}

export function atomicReceiveWithMemory(store: IProducerStore, reducers: EventReducersMap) {

   store.memory = new StateMemory<ModelEvent<any>>()
   store.reducers = reducers

   // Trying handle event by reducers in storage
   // If event not handled (handler return false) and storage have memory
   // event adding to storage memory
   receive(store, (event) => {
      const {payload} = event
      if (!payload) {
         console.error('Not have payload on event:', event)
         throw new Error('Not have event payload')
      }

      const {store} = payload

      const {isHaveReducer, isHandled} = handleEventByReducer(event)
      if (!isHaveReducer) {
         return
      }

      if (isHandled || !store.memory) {
         return
      }

      store.memory.push(event)
   })
}

export function asyncReceiveWithMemory(store: IProducerStore, reducers: EventReducersMap) {
   const {dispatcher, subscription} = store

   if (subscription) {
      subscription.unsubscribe()
   }

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
      const {payload: {store}} = event

      const {isHaveReducer, isHandled} = handleEventByReducer(event)
      if (!isHaveReducer) {
         return
      }

      if (!isHandled || !store.memory) {
         return
      }

      store.memory.remove(event)
   })
}

function saveInMemoryIfCan<Payload extends ModelEventPayload = ModelEventPayload>(event: ModelEvent<Payload | undefined>) {
   const {payload} = event
   if (!payload) {
      console.error('Not have payload on event:', event)
      throw new Error('Not have event payload')
   }

   const {store} = payload
   console.log('save in memory', event, store.memory)
   if (store.memory) {
      store.memory.push(event)
   }
}

export interface EventHandleResult {
   isHaveReducer: boolean,
   isHandled: boolean
}

function handleEventByReducer<T extends ModelEventPayload = ModelEventPayload>(event: ModelEvent<T | undefined>): EventHandleResult {
   const {payload} = event
   if (!payload) {
      console.error('Not have payload on event:', event)
      throw new Error('Not have event payload')
   }

   const {store} = payload

   if (!store.reducers) {
      return {isHaveReducer: false, isHandled: false}
   }

   const handler = store.reducers[event.type]

   if (!handler) {
      console.warn('Not have handler for event', event)
      return {isHaveReducer: false, isHandled: false}
   }

   return {
      isHaveReducer: true,
      isHandled: !!handler(store, event.payload),
   }
}

