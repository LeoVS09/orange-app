import {AbstractData, EventReducersMap, EventType, ModelEventGetPropertyPayload} from '@/lazyDB/core/types'
import {lastObjectPropertyName} from '@/lazyDB/database/utils'
import {ModelReadSchema} from '@/lazyDB/types'
import {appendPropertyToSchema} from '@/lazyDB/database/readSchema'
import {IDatabaseProducerStore} from '@/lazyDB/database/types'

export function isExcludeProperty({excludeProperties}: IDatabaseProducerStore, payload: ModelEventGetPropertyPayload) {
   if (!excludeProperties) {
      return false
   }

   const prop = lastObjectPropertyName(payload)

   return excludeProperties.includes(prop)
}

export const databaseReducers: EventReducersMap = {
   [EventType.GetProperty]: (store, payload) => {
      if (isExcludeProperty(store, payload))
         return true

      return false
   },

   [EventType.SetProperty]: (store, payload) => {
      return false
   },

   [EventType.DeleteProperty]: (store, payload) => {
      return false
   },
}

function getOrCreateReadSchema(store: IDatabaseProducerStore): ModelReadSchema {
   const {readSchema} = store
   if (readSchema)
      return readSchema

   return store.readSchema = {}
}

export const repositoryReducers: EventReducersMap = {
   [EventType.GetProperty]: (store, payload) => {
      if (isExcludeProperty(store, payload))
         return true

      const readSchema = getOrCreateReadSchema(store)
      appendPropertyToSchema(readSchema, payload)

      console.log('readSchema', readSchema)

      return false
   },

   [EventType.SetProperty]: (store, payload) => {
      return false
   },

   [EventType.DeleteProperty]: (store, payload) => {
      return false
   },
}
