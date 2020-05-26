import {
  IProducerStore,
  ProducerStoreReference,
  ModelPropertyKey
} from '../types'
import { isProducerable, getStore } from '../common'
import { wrapInProducerIfNot } from '../wrap'
import { setupEventBubbling } from '../bubbling'
import { isExplictlyAccessPropty } from './explictly'

export function get<Store extends IProducerStore<any, any> = IProducerStore>(store: Store, prop: PropertyKey) {
  // Directly check with reference
  // need for ProducerStoreReference is string
  if (prop === ProducerStoreReference)
    return store

  if (isExplictlyAccessPropty(prop))
    return store.base[prop]

  return getterHook(store, prop as ModelPropertyKey)
}

// hook will spawn event
// get value from getter
// and then wrap value to producer if need
export const getterHook = <Store extends IProducerStore<any, any> = IProducerStore>(
  store: Store,
  prop: ModelPropertyKey
) => {
  const {
    dispatcher,
    getter,
    setter
  } = store

  dispatcher.get(prop, store)

  const value = getter(store, prop) // default is `(_, prop) => store.base[prop]`

  if (!isProducerable(value))
    return value

  // value is object or array
  // need wrap it to producer
  const producer = wrapInProducerIfNot(value)

  // if value wasn't producer
  // need rewrite value of property as producer
  if (producer !== value)
    setter(store, prop, producer) // default is `(_, prop, value) => store.base[prop] = value`

  // set current store as parent for producer
  // for send events to parent
  const childStore = getStore(producer)
  setupEventBubbling(childStore!, store, prop)

  return producer
}
