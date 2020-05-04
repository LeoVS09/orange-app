import {
  IProducerStore,
  EventReducersMap,
  ModelEvent,
  EventReducer
} from '../types'
import { receive } from './receive'
import { getReducer, getStoreFromEvent } from './getters'
import { isPromise } from './utils'

export function atomicReceiveByReducers(store: IProducerStore, reducers: EventReducersMap) {
  store.reducers = reducers

  receive(store, event => {
    const reducer = getReducer(event)
    if (!reducer)
      return

    handleByReducer(event, reducer)
  })
}

export function asyncReceiveByReducers(store: IProducerStore, reducers: EventReducersMap) {
  store.reducers = reducers

  receive(store, async event => {
    const reducer = getReducer(event)
    if (!reducer)
      return

    handleByReducer(event, reducer)
  })
}

export function handleByReducer(event: ModelEvent<any>, reducer: EventReducer<any>): boolean | Promise<boolean | void | undefined> {
  const store = getStoreFromEvent(event)

  const result = reducer(store, event.payload)
  if (isPromise(result))
    return result

  return !!result
}
