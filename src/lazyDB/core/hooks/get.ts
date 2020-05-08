import { AosFieldType } from '@/abstractObjectSchema'
import {
  IProducerStore,
  ProducerStoreReference,
  EventProducer,
  AbstractData
} from '../types'
import { isProducerable, getStore } from '../common'
import { wrapInProducerIfNot } from '../wrap'
import { setEventReceiverToParent } from '../toParent'
import { isExplictlyAccessPropty } from './explictly'

export function get(store: IProducerStore, prop: PropertyKey) {
  // Directly check with reference
  // need for ProducerStoreReference is string
  if (prop === ProducerStoreReference)
    return store

  if (isExplictlyAccessPropty(prop))
    return store.base[prop as string]

  return getterHook(store, prop)
}

// hook will spawn event
// get value from getter
// and then wrap value to producer if need
export const getterHook = (store: IProducerStore, prop: PropertyKey) => {
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
  defineParentOfProducer(producer, store, prop)

  return producer
}

export const defineParentOfProducer = (producer: EventProducer, parent: IProducerStore, prop: PropertyKey) => {
  const valueStore = getStore(producer)
  valueStore.parent = parent

  const store = getStore(producer)
  const type = getFieldType(parent.base)

  setEventReceiverToParent(store, prop, type)
}

const getFieldType = (base: AbstractData) => {
  if (Array.isArray(base))
    return AosFieldType.OneToMany

  return AosFieldType.OneToOne
}
