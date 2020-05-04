import { ModelEvent, IProducerStore, EventReducer } from '../types'

export function getStoreFromEvent(event: ModelEvent<any>): IProducerStore {
  const { payload } = event
  // TODO: remove when store will be outside from payload
  if (!payload) {
    console.error('Not have payload on event:', event)
    throw new Error('Not have event payload')
  }

  return payload.store
}

export function getReducer(event: ModelEvent<any>): EventReducer<any> | undefined {
  const store = getStoreFromEvent(event)

  if (!store.reducers)
    return

  return store.reducers[event.type]
}
