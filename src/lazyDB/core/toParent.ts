import {
   IProducerStore,
   ModelAttributeType,
   ModelEvent,
   ModelEventGetPropertyPayload,
   ModelEventInnerPayload, ModelEventPayload,
   ModelEventSetPropertyPayload,
} from './types'
import { receive} from './receiver'
import { getEventPayload, setEventPayload} from './common'

export function pushPropertyEventsToParent(child: IProducerStore, prop: PropertyKey, type: ModelAttributeType = ModelAttributeType.OneToOne) {
   receive(child, (event) =>
      pushToParentIfCan(child, prop, event, type),
   )
}

export function pushToParentIfCan(
   child: IProducerStore,
   prop: PropertyKey,
   event: ModelEvent<ModelEventPayload | undefined>,
   type: ModelAttributeType = ModelAttributeType.OneToOne,
) {
   const { parent} = child
   if (!parent)
      return

   const wrapped = wrapEventToNestingLevel(prop, type, parent, event)

   const { dispatcher} = parent
   dispatcher.eventsSubject.next(wrapped)
}

export const wrapEventToNestingLevel = <T = ModelEventGetPropertyPayload>(
   name: PropertyKey,
   type: ModelAttributeType,
   store: IProducerStore,
   event: ModelEvent<T>,
): ModelEvent<ModelEventInnerPayload<T>> => ({

   ...event,

   payload: {
      store,
      name,
      type,

      inner: event.payload,
   },
})

export function wrapGetEventToNestingLevel(
   name: PropertyKey,
   type: ModelAttributeType,
   store: IProducerStore,
   event: ModelEvent<ModelEventGetPropertyPayload>,
): ModelEvent<ModelEventGetPropertyPayload> {

   const inner = event.payload

   const payload = getEventPayload(name, store, type, inner)

   return {
      ...event,
      payload,
   }
}

export function wrapSetEventToNestingLevel(
   name: PropertyKey,
   type: ModelAttributeType,
   store: IProducerStore,
   event: ModelEvent<ModelEventSetPropertyPayload>,
): ModelEvent<ModelEventSetPropertyPayload> {

   const inner = event.payload

   const payload = setEventPayload(name, null, null, store, type, inner)

   return {
      ...event,
      payload,
   }
}
