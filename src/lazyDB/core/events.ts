import {
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  ModelEventPayload,
  ModelEvent,
  PropertyEventType
} from '@/lazyDB/core/types'

export const isEventsEqual = (a: ModelEvent<any, any>, b: ModelEvent<any, any>) => {
  switch (a.type) {
    case PropertyEventType.GetProperty:
    case PropertyEventType.DeleteProperty: {
      return isGetEventsEqual(a.payload, b.payload)
    }
    case PropertyEventType.SetProperty: {
      return isSetEventsEqual(a.payload, b.payload as ModelEventSetPropertyPayload)
    }
    default: {
      return false
    }
  }
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
