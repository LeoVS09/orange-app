import {
  ModelEvent,
  ModelEventGetPropertyPayload,
  PropertyEventPayload,
  isPropertyEvent
} from '../core/types'
import { ModelEventTypes } from './events'

export const notHaveGetEventInMemory = (event: ModelEvent<ModelEventGetPropertyPayload>) => {
  if (event.type !== ModelEventTypes.GetProperty)
    return true

  const { payload: { store } } = event
  if (!store || !store.memory)
    return true

  const { memory } = store.memory

  return !memory.some(({ payload, type }) => type === ModelEventTypes.GetProperty
      && isGetEventPayloadsEqual(event.payload, payload))
}

export const excludePropertyEventWithNames = (excludeProperties: Array<string>) => (event: ModelEvent<PropertyEventPayload>) => {
  if (!isPropertyEvent(event))
    return true

  const { name } = event.payload
  if (excludeProperties.some(value => value === name))
    return false

  return true
}

export function isGetEventPayloadsEqual(first: ModelEventGetPropertyPayload, second: ModelEventGetPropertyPayload): boolean {
  if (first.name !== second.name)
    return false

  if (first.type !== second.type)
    return false

  return true
}
