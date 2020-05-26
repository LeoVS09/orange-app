import { IProducerStore, ModelPropertyKey } from '../types'
import { isExplictlyAccessPropty } from './explictly'

export function set<Store extends IProducerStore<any, any> = IProducerStore>(store: Store, prop: PropertyKey, value: any) {
  if (isExplictlyAccessPropty(prop)) {
    store.base[prop as unknown as string] = value
    return true
  }

  return setterHook(store, prop as ModelPropertyKey, value)
}

// will spawn set event
// and call setter
function setterHook<Store extends IProducerStore<any, any> = IProducerStore>(
  store: Store,
  prop: ModelPropertyKey,
  value: any
) {
  const {
    dispatcher,
    setter,
    getter
  } = store

  const oldValue = getter(store, prop)

  dispatcher.set(prop, oldValue, value, store)

  return setter(store, prop, value)
}
