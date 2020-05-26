import { AosFieldType } from '@/abstractObjectSchema'
import {
  Producerable,
  EventProducer,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  IProducerStore,
  ProducerStoreReference,
  ModelPropertyKey
} from './types'

export function getStore<
  T extends Producerable<any> = Producerable,
  Store extends IProducerStore<T, any> = IProducerStore<T>
>(producer: EventProducer<T> | T): Store | undefined {
  return producer[ProducerStoreReference]
}
export function isProducer<T extends Producerable<any> = Producerable>(value: T | EventProducer<T>): value is EventProducer<T> {
  if (!value || typeof value !== 'object')
    return false

  return !!value[ProducerStoreReference]
}

// will be true only if it object created without class,
// and not a function
export function isPlainObject(value: any): value is object {
  if (!value || typeof value !== 'object')
    return false

  const proto = Object.getPrototypeOf(value)
  if (!proto || proto === Object.prototype)
    return true

  return false
}

export function isDate(value: any): value is Date {
  return value instanceof Date
}

export function isProducerable<T>(value: T | Producerable<T>): value is Producerable<T> {
  if (!value || typeof value !== 'object')
    return false

  if (Array.isArray(value))
    return true

  if (isDate(value))
    return false

  // if need exlcude class object, use isPlainObject
  if (typeof value === 'object' && value !== null)
    return true

  // TODO: add functions
  return false
}

export const getEventPayload = <
  Store extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey
> (
    name: Key,
    store: Store,
    type: AosFieldType = AosFieldType.Any
  ): ModelEventGetPropertyPayload<Store, Key> => ({
    store,
    name,
    type
  })

export const setEventPayload = <
  Store extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey,
  OldValue = any,
  NewValue = any
> (
    name: Key,
    oldValue: OldValue,
    newValue: NewValue,
    store: Store,
    type: AosFieldType = AosFieldType.Any
  ): ModelEventSetPropertyPayload<Store, Key, OldValue, NewValue> => ({
    store,
    name,
    type,
    oldValue,
    newValue
  })
