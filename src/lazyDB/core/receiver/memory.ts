import { AosFieldType } from '@/abstractObjectSchema'
import { filter, tap, share } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { debug } from '@/reactive/debug'
import {
  IProducerStore,
  EventReducersMap,
  ModelEvent,
  ModelEventPayload
} from '../types'
import { StateMemory } from '../memory'
import { receive, unsubscribeStore } from './receive'
import { isHaveEventInMemory } from '../events'
import { getReducer, getStoreFromEvent } from './getters'
import { handleByReducer } from './reducers'
import { async } from './utils'
import { pushToParentIfCan } from '../toParent'

// TODO: refactor, may be this must be event handler
export function atomicReceiveWithMemory(prducerStore: IProducerStore, reducers: EventReducersMap) {
  prducerStore.memory = new StateMemory<ModelEvent<any>>()
  prducerStore.reducers = reducers

  // Trying handle event by reducers in storage
  // If event not handled (handler return false) and storage have memory
  // event adding to storage memory
  receive(prducerStore, event => {
    if (isHaveEventInMemory(event))
      return

    const reducer = getReducer(event)
    if (!reducer)
      return

    const handleResult = handleByReducer(event, reducer)

    const store = getStoreFromEvent(event)

    async(handleResult)
      .then(isHandled => {
        if (isHandled || !store.memory)
          return

        store.memory.push(event)
      })
  })
}

export function asyncReceiveWithMemory(
  store: IProducerStore,
  reducers: EventReducersMap,
  prop?: PropertyKey,
  type?: AosFieldType
) {
  unsubscribeStore(store)

  const { dispatcher } = store

  store.memory = new StateMemory<ModelEvent<any>>()
  store.reducers = reducers

  // Trying handle event by reducers in storage
  // If event handled (handler return true) and storage have memory
  // event would remove from storage memory
  store.stream = dispatcher.eventsSubject
    .pipe(
      filter(event => !isHaveEventInMemory(event)),
      debug('not have event in memory'),
      saveInMemory(false),
      share()
    )

  store.subscription = store.stream!.subscribe(async event => {
    const reducer = getReducer(event)
    if (!reducer) {
      if (prop)
        pushToParentIfCan(store, prop, event, type)
      else
        console.warn('Not have handler for event', event)
      return
    }

    const handlerResult = handleByReducer(event, reducer)
    const isHandled = await async(handlerResult)

    if (!isHandled || !store.memory)
      return

    store.memory.remove(event)
  })
}

const saveInMemory = <Payload extends ModelEventPayload = ModelEventPayload>(failIfCannot: boolean) => (stream: Observable<ModelEvent<Payload | undefined>>) =>
  stream.pipe(tap(event => {
    const store = getStoreFromEvent(event)

    if (!store.memory) {
      if (!failIfCannot) {
        console.warn('Cannot save event in memory', event)
        return
      }
      throw new Error(`Cannot save event in memory, event store not have memory event: ${event}`)
    }

    store.memory.push(event)
  }))
