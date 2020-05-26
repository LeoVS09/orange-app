import {
  ModelEvent,
  IProducerStore,
  EventReducer,
  ModelTypesToPayloadsMap,
  ModelEventPayload,
  isProducerStore
} from '../types'

export function isModelEventPayload<
  Store extends IProducerStore<any, any> = IProducerStore
>(payload: any): payload is ModelEventPayload<Store> {
  if (typeof payload !== 'object')
    return false

  return isProducerStore(payload.store)
}

export function getStoreFromEvent<
  Store extends IProducerStore<any, any> = IProducerStore
>(event: ModelEvent<any, any>): Store {
  const { payload } = event
  // TODO: remove when store will be outside from payload
  if (!isModelEventPayload<Store>(payload)) {
    console.error('Not have payload on event:', event)
    throw new Error('Not have event payload')
  }

  return payload.store
}
