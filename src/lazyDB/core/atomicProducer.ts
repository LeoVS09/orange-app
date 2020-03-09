import { atomicReceiveByReducers } from '@/lazyDB/core/receiver'
import { AtomicModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/atomic'
import {
  AbstractData,
  EventReducer, EventType,
  ModelEventDeletePropertyPayload,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload
} from './types'
import { wrapInProducer } from './producer/wrap'
import { getStore } from './common'

export interface AtomicProducerActions {
   get?: EventReducer<ModelEventGetPropertyPayload>
   set?: EventReducer<ModelEventSetPropertyPayload>
   delete?: EventReducer<ModelEventDeletePropertyPayload>
}

export function makeAtomicProducer<T extends AbstractData = AbstractData>(
  { get, set, delete: deleteAction }: AtomicProducerActions,
  base: T = { } as T
) {
  const producer = wrapInProducer(base, new AtomicModelEventDispatcher())
  const store = getStore(producer)!

  atomicReceiveByReducers(store, {
    [EventType.GetProperty]: get,
    [EventType.SetProperty]: set,
    [EventType.DeleteProperty]: deleteAction
  })

  // cannot handle internal producers by atomic

  return producer
}
