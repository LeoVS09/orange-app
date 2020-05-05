import { AosFieldType } from '@/abstractObjectSchema'
import {
  AbstractData,
  EventProducer,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  IProducerStore,
  ProducerStoreReference
} from './types'

export interface GetStore<T = AbstractData> {
   (producer: EventProducer): IProducerStore<T>
   (producer: AbstractData): IProducerStore<T> | undefined
}

export const getStore: GetStore = <T = AbstractData>(producer: EventProducer): IProducerStore<T> => producer[ProducerStoreReference]

export function isProducer(value: any): value is EventProducer {
  if (!value || typeof value !== 'object')
    return false

  return !!value[ProducerStoreReference]
}

export function isProducerable(value: any): value is AbstractData {
  if (!value || typeof value !== 'object')
    return false

  // TODO: make array wrap to producer
  if (Array.isArray(value))
    return true

  const proto = Object.getPrototypeOf(value)
  if (!proto || proto === Object.prototype)
    return true

  // TODO: add functions
  return false
}

export const getEventPayload = (
  name: PropertyKey,
  store: IProducerStore,
  type: AosFieldType = AosFieldType.Any,
  inner?: ModelEventGetPropertyPayload
): ModelEventGetPropertyPayload => ({
  store,
  name,
  type,
  inner
})

export const setEventPayload = (
  name: PropertyKey,
  oldValue: any,
  newValue: any,
  store: IProducerStore,
  type: AosFieldType = AosFieldType.Any,
  inner?: ModelEventSetPropertyPayload
): ModelEventSetPropertyPayload => ({
  store,
  name,
  type,
  oldValue,
  newValue,
  inner
})
