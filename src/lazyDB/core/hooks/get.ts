import {
  IProducerStore,
  ProducerStoreReference,
  ModelPropertyKey
} from '../types'
import { isProducerable, getStore, isProducer } from '../common'
import { wrapInProducerIfNot, wrapInProducer } from '../wrap'
import { setupEventBubbling } from '../bubbling'
import { isExplictlyAccessPropty } from './explictly'

export function get<Store extends IProducerStore<any, any> = IProducerStore>(store: Store, prop: PropertyKey) {
  // Directly check with reference
  // need when ProducerStoreReference is string
  if (prop === ProducerStoreReference)
    return store

  if (isExplictlyAccessPropty(prop))
    return store.base[prop]

  return getterHook(store, prop as ModelPropertyKey)
}

/**
 * hook will spawn event, receive value from getter,
 * and then wrap value to producer if need
 */
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

  let value = getter(store, prop) // default is `(_, prop) => store.base[prop]`

  if (!isProducerable(value))
    // if value primitive and cannot be reactive
    return value

  if (!isProducer(value)) {
    // if value is object or array, but not producer
    // need wrap it to producer
    value = wrapInProducer(value)
    // and rewrite field value as producer
    setter(store, prop, value) // default is `(_, prop, value) => store.base[prop] = value`
  }

  // set value store as parent
  // for send events hierarily
  const childStore = getStore(value)!
  setupEventBubbling(childStore, store, prop)

  return value
}
