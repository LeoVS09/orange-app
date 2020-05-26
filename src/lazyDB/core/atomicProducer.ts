import { atomicReceiveByReducers } from './receiver'
import { AtomicModelEventDispatcher } from './dispatcher/model/atomic'
import {
  Producerable,
  EventReducer,
  PropertyEventType,
  ModelEventDeletePropertyPayload,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  ModelTypesToPayloadsMap,
  IProducerStore,
  AtomicEventReducer,
  AtomicEventReducersMap
} from './types'
import { wrapInProducer } from './wrap'
import { getStore } from './common'

export interface AtomicProducerActions<Store extends IProducerStore<any, any> = IProducerStore> {
   get?: AtomicEventReducer<Store, ModelEventGetPropertyPayload>
   set?: AtomicEventReducer<Store, ModelEventSetPropertyPayload>
   delete?: AtomicEventReducer<Store, ModelEventDeletePropertyPayload>
}

export function makeAtomicProducer<
  T extends Producerable<any> = Producerable,
  Store extends IProducerStore<T, any> = IProducerStore<T>,
>(
  {
    get = () => true,
    set = (store, { payload: { oldValue, newValue } }) => oldValue === newValue,
    delete: deleteAction = () => false
  }: AtomicProducerActions<Store>,
  base: T = { } as T
) {
  const producer = wrapInProducer<T, AtomicModelEventDispatcher<Store>>(base, new AtomicModelEventDispatcher<Store>())
  const store = getStore<T, Store>(producer)!

  const reducers = {
    [PropertyEventType.GetProperty]: get,
    [PropertyEventType.SetProperty]: set,
    [PropertyEventType.DeleteProperty]: deleteAction
  } as unknown as AtomicEventReducersMap<IProducerStore<any, any>, any>

  atomicReceiveByReducers(store, reducers)

  // cannot handle internal producers by atomic

  return producer
}
