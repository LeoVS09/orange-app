import {EventProducer, ModelEvent, ModelEventGetPropertyPayload, PropertyEventPayload} from "../core/types";
import {ModelEventTypes} from './events'
import {lastObjectPropertyName} from "./utils";

export const notHaveGetEventInMemory = (event: ModelEvent<ModelEventGetPropertyPayload>) => {
   if (event.type !== ModelEventTypes.GetProperty)
      return true

   const {payload: {store}} = event
   if (!store || !store.memory)
      return true

   const {memory} = store.memory

   return !memory.some(({payload, type}) =>
      type === ModelEventTypes.GetProperty &&
      getEventPayloadsEqual(event.payload, payload)
   )
}

export const excludePropertyEventWithNames = (excludeProperties: Array<string>) =>
   (event: ModelEvent<PropertyEventPayload>) => {
      const { type } = event

      if (
         type !== ModelEventTypes.GetProperty &&
         type !== ModelEventTypes.SetProperty &&
         type !== ModelEventTypes.DeleteProperty
      )
         return true

      const innerName = lastObjectPropertyName(event.payload as ModelEventGetPropertyPayload)
      if (excludeProperties.some(value => value === innerName))
         return false

      return true
   }

export function getEventPayloadsEqual(first: ModelEventGetPropertyPayload, second: ModelEventGetPropertyPayload): boolean {
   if (first.name !== second.name)
      return false

   if (first.type !== second.type)
      return false

   if (!first.inner && !second.inner)
      return true

   if (first.inner && second.inner)
      return getEventPayloadsEqual(first.inner, second.inner)

   return false
}
