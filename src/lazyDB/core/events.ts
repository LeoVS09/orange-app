import {
  PropertyEventType,
  ModelEvent,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  ModelEventPayload,
  IProducerStore,
  ModelEventPropertyPayload
} from '@/lazyDB/core/types'
import { StateMemory } from './memory'

export function isHaveEventInMemory<
  Event extends ModelEvent<ModelEventPropertyPayload<any, any>> = ModelEvent<ModelEventPropertyPayload<any, any>>
>({ payload }: Event, memory: StateMemory<ModelEvent<any, any>>) {

  const index = memory!.findIndex((event: ModelEvent<any, any>) => {
    switch (event.type) {
      case PropertyEventType.GetProperty:
      case PropertyEventType.DeleteProperty: {
        return isGetEventsEqual(event.payload, payload)
      }
      case PropertyEventType.SetProperty: {
        return isSetEventsEqual(event.payload, payload as ModelEventSetPropertyPayload)
      }
      default: {
        return false
      }
    }
  })

  return index !== -1
}

export function isGetEventsEqual(a: ModelEventGetPropertyPayload, b: ModelEventGetPropertyPayload): boolean {
  if (a.store !== b.store)
    return false

  if (
    a.name !== b.name
    || a.type !== b.type
  )
    return false

  return true
}

export function isSetEventsEqual(a: ModelEventSetPropertyPayload, b: ModelEventSetPropertyPayload): boolean {
  if (a.store !== b.store)
    return false

  if (
    a.name !== b.name
    || a.type !== b.type
    || a.oldValue !== b.oldValue
    || a.newValue !== b.newValue
  )
    return false

  return true
}

export function isParentsEqual(a: ModelEventPayload, b: ModelEventPayload) {
  if (!a.store.parent && !b.store.parent)
    return true

  if (a.store.parent !== b.store.parent)
    return false

  return true
}
