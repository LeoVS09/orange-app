import {
   EventType,
   ModelAttributeType,
   ModelEvent,
   ModelEventGetPropertyPayload,
   ModelEventSetPropertyPayload,
   IProducerStore,
} from "./types";
import {receive} from "./receiver";
import {getEventPayload, setEventPayload} from "./common";

export function pushPropertyEventsToParent(parent: IProducerStore, child: IProducerStore, prop: PropertyKey, type: ModelAttributeType) {
   receive(child, event => {

      switch (event.type) {
         case EventType.GetProperty:
         case EventType.DeleteProperty: {
            event = wrapGetEventToNestingLevel(prop, type, parent, event as ModelEvent<ModelEventGetPropertyPayload>)
            break
         }

         case EventType.SetProperty: {
            event = wrapSetEventToNestingLevel(prop, type, parent, event as ModelEvent<ModelEventSetPropertyPayload>)
            break
         }

         default:
            console.warn('Not have wrapper to nesting level for event:', event)
            return
      }

      const { dispatcher } = parent
      dispatcher.eventsSubject.next(event)
   })
}

export function wrapGetEventToNestingLevel(
   name: PropertyKey,
   type: ModelAttributeType,
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
   type: ModelAttributeType,
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
