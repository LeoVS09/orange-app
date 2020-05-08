import { AosFieldType } from '@/abstractObjectSchema'
import {
  IProducerStore,
  ModelEvent,
  ModelEventGetPropertyPayload,
  ModelEventInnerPayload, ModelEventPayload,
  ModelEventSetPropertyPayload
} from './types'
import { receive } from './receiver'
import { getEventPayload, setEventPayload } from './common'

export function setEventReceiverToParent(
  child: IProducerStore,
  prop: PropertyKey,
  type: AosFieldType = AosFieldType.OneToOne
) {
  receive(child, event => pushToParentIfCan(child, prop, event, type))
}

export function pushToParentIfCan(
  { parent }: IProducerStore,
  prop: PropertyKey,
  event: ModelEvent<ModelEventPayload | undefined>,
  type: AosFieldType = AosFieldType.OneToOne
) {
  if (!parent)
    return

  const wrapped = wrapEventToNestingLevel(prop, type, parent, event)

  const { dispatcher } = parent
  if (!dispatcher) {
    console.error('Parent not have dispatcher', parent)
    return
  }

  dispatcher.eventsSubject.next(wrapped)
}

export const wrapEventToNestingLevel = <T = ModelEventGetPropertyPayload>(
  name: PropertyKey,
  type: AosFieldType,
  store: IProducerStore,
  event: ModelEvent<T>
): ModelEvent<ModelEventInnerPayload<T>> => ({

    ...event,

    payload: {
      store,
      name,
      type,

      inner: event.payload
    }
  })

export function wrapGetEventToNestingLevel(
  name: PropertyKey,
  type: AosFieldType,
  store: IProducerStore,
  event: ModelEvent<ModelEventGetPropertyPayload>
): ModelEvent<ModelEventGetPropertyPayload> {
  const inner = event.payload

  const payload = getEventPayload(name, store, type, inner)

  return {
    ...event,
    payload
  }
}

export function wrapSetEventToNestingLevel(
  name: PropertyKey,
  type: AosFieldType,
  store: IProducerStore,
  event: ModelEvent<ModelEventSetPropertyPayload>
): ModelEvent<ModelEventSetPropertyPayload> {
  const inner = event.payload

  const payload = setEventPayload(name, null, null, store, type, inner)

  return {
    ...event,
    payload
  }
}
