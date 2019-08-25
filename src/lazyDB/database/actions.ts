import {AbstractData, EventReducersMap, EventType, ModelEventGetPropertyPayload} from "@/lazyDB/core/types";
import {lastObjectPropertyName} from "@/lazyDB/database/utils";
import {SymFor} from "@/lazyDB/core/utils";
import {ModelReadSchema} from "@/lazyDB/types";
import {appendPropertyToSchema} from "@/lazyDB/database/readSchema";

export const ExcludePropertiesReference = SymFor('exclude properties')

export function isExcludeProperty(base: AbstractData, payload: ModelEventGetPropertyPayload) {
   const excludeProperties = base[ExcludePropertiesReference] as Array<string>
   if(!excludeProperties)
      return false

   const prop = lastObjectPropertyName(payload)

   return excludeProperties.includes(prop)
}

export const databaseReducers: EventReducersMap = {
   [EventType.GetProperty]: ({base}, payload) => {
      console.log('EventType.GetProperty', payload)

      if(isExcludeProperty(base, payload))
         return true

      return false
   },

   [EventType.SetProperty]: (store, payload) => {
      console.log('EventType.SetProperty', payload)
      return false
   },

   [EventType.DeleteProperty]: (store, payload) => {
      console.log('EventType.DeleteProperty', payload)
      return false
   }
}

export const ModelReadSchemaReference = SymFor('read schema')

function getReadSchema(base: AbstractData): ModelReadSchema {
   const schema = base[ModelReadSchemaReference]
   if(schema)
      return schema

   return base[ModelReadSchemaReference] = {}
}

export const repositoryReducers: EventReducersMap = {
   [EventType.GetProperty]: ({base}, payload) => {
      console.log('EventType.GetProperty', payload)

      if(isExcludeProperty(base, payload))
         return true

      const readSchema = getReadSchema(base)
      appendPropertyToSchema(readSchema, payload)

      console.log('readSchema', readSchema)

      return false
   },

   [EventType.SetProperty]: (store, payload) => {
      console.log('EventType.SetProperty', payload)
      return false
   },

   [EventType.DeleteProperty]: (store, payload) => {
      console.log('EventType.DeleteProperty', payload)
      return false
   }
}
