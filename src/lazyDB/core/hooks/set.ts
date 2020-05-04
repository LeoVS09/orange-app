import { IProducerStore } from '../types'
import { isExplictlyAccessPropty } from './explictly'

export function set(store: IProducerStore, prop: PropertyKey, value: any) {
  if (isExplictlyAccessPropty(prop)) {
    store.base[prop as unknown as string] = value
    return true
  }

  return setterHook(store, prop, value)
}

// will spawn set event
// and call setter
function setterHook(store: IProducerStore, prop: PropertyKey, value: any) {
  const {
    dispatcher,
    setter,
    getter
  } = store

  const oldValue = getter(store, prop)

  dispatcher.set(prop, oldValue, value, store)

  return setter(store, prop, value)
}
