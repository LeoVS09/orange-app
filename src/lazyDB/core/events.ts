import {
  EventType,
  ModelEvent,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  ModelEventPayload
} from '@/lazyDB/core/types'

export function isHaveEventInMemory(modelEvent: ModelEvent<any>) {
  const { payload } = modelEvent
  const { store } = payload
  const { memory } = store

  const index = memory!.findIndex((event: ModelEvent<any>) => {
    switch (event.type) {
      case EventType.GetProperty:
      case EventType.DeleteProperty: {
        return isGetEventsEqual(event.payload, payload)
      }
      case EventType.SetProperty: {
        return isSetEventsEqual(event.payload, payload)
      }
      default: {
        return false
      }
    }
  })

  debugNotHaveEvent(payload, index)

  return index !== -1
}

const debugNotHaveEvent = (payload: ModelEventPayload, index: number) =>
  index === -1 && console.log('Not have event in memory', payload, payload.store.memory)

export function isGetEventsEqual(a: ModelEventGetPropertyPayload, b: ModelEventGetPropertyPayload): boolean {
  if (a.name !== b.name || a.type !== b.type)
    return false

  if (!a.inner && !b.inner)
    return true

  if (!a.inner || !b.inner)
    return false

  return isGetEventsEqual(a.inner, b.inner)
}

export function isSetEventsEqual(a: ModelEventSetPropertyPayload, b: ModelEventSetPropertyPayload): boolean {
  if (a.name !== b.name || a.type !== b.type || a.oldValue !== b.oldValue || a.newValue !== b.newValue)
    return false

  if (!a.inner && !b.inner)
    return true

  if (!a.inner || !b.inner)
    return false

  return isSetEventsEqual(a.inner, b.inner)
}
