import { AbstractData, EventReducersMap, EventType, ModelEvent, ModelEventGetPropertyPayload} from '@/lazyDB/core/types'
import { lastObjectPropertyName} from '@/lazyDB/database/utils'
import { ModelReadSchema} from '@/lazyDB/types'
import { appendPropertyToSchema} from '@/lazyDB/database/readSchema'
import { IDatabaseProducerStore} from '@/lazyDB/database/types'
import {
   ModelEventTypes,
   ReadEventPayload,
   ReadFailureEventPayload,
   ReadSuccessEventPayload,
} from '@/lazyDB/database/events'
import { isSchemaField, wait} from '@/lazyDB/utils'
import { QueryField} from '@/lazyDB/connectors/queryMapper'

const api = {
   async fetch(entity: string, id: string, readSchema: ModelReadSchema) {
      await wait(10000)

      const cityNames = ['some', 'strange', 'day', 'of', 'time']


      return {
         id,
         name: `${entity} ${id}`,
         code: 'some code',
         createdAt: new Date(),
         updatedAt: new Date(),
         cities: new Array(7).fill(0).map( (i) => ({
            id: i,
            name: `city ${cityNames[Math.random()]}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            countryId: id,
         })),
      }
   },
}

export function isExcludeProperty({ excludeProperties }: IDatabaseProducerStore, payload: ModelEventGetPropertyPayload) {
   if (!excludeProperties) {
      return false
   }

   const prop = lastObjectPropertyName(payload)

   return excludeProperties.includes(prop)
}

const removeGetEventsFromMemory = ({ store, gets }: ReadEventPayload) => {
   const { memory} = store

   if (memory)
      memory.remove(...gets)
}

const dispatchReadSuccess = ({ store }: ReadEventPayload, responseData: AbstractData) => {
   const { dispatcher } = store
   dispatcher.readSuccess(responseData, store)
}

const dispatchReadFailure = ({ store }: ReadEventPayload, error: any) => {
   const { dispatcher } = store
   dispatcher.readFailure(error, store)
}

export const databaseReducers: EventReducersMap = {
   [ModelEventTypes.GetProperty]: (store, payload) => {
      if (isExcludeProperty(store as IDatabaseProducerStore, payload))
         return true

      return false
   },

   [ModelEventTypes.SetProperty]: (store, payload) => {
      return false
   },

   [ModelEventTypes.DeleteProperty]: (store, payload) => {
      return false
   },

   // Add ts support for inner read payload
   [ModelEventTypes.Read]: async ({ dispatcher }, payload) => {

      const getRequest = `${payload.name}/${payload.inner.name}/`
      try {
         console.log(getRequest, schemaToQueryFields(payload.inner.inner.readSchema))

         const response = await api.fetch(payload.name, payload.inner.name, payload.inner.inner.readSchema)

         removeGetEventsFromMemory(payload.inner.inner)

         dispatchReadSuccess(payload.inner.inner, response)

      } catch (err) {
         dispatchReadFailure(payload.inner.inner, err)
      }

      return true
   },

   [ModelEventTypes.ReadSuccess]: (_, payload) => {

      const {data, store} = payload.inner.inner
      const {base} = store
      for(const key in data)
         base[key] = data[key]

      console.log('ModelEventTypes.ReadSuccess', base, data)

      return true
   },

   [ModelEventTypes.ReadFailure]: ({ base }, { error}: ReadFailureEventPayload) => {
      console.error(base, error)
      // TODO: handle error
      return false
   },
}


function getOrCreateReadSchema(store: IDatabaseProducerStore): ModelReadSchema {
   const { readSchema} = store
   if (readSchema)
      return readSchema

   return store.readSchema = { }
}

// TODO: multiple types of object schema, need better solution
export function schemaToQueryFields(schema: ModelReadSchema): Array<string | QueryField> {
   const keys = Object.keys(schema)

   return keys.map((key) => {
      const field = schema[key]
      if (!isSchemaField(field))
         return key

      return {
         entity: key,
         type: field.type,
         fields: schemaToQueryFields(field.fields as ModelReadSchema),
      }
   })
}

export const repositoryReducers: EventReducersMap = {
   [ModelEventTypes.GetProperty]: (store, payload) => {
      if (isExcludeProperty(store as IDatabaseProducerStore, payload))
         return true

      const readSchema = getOrCreateReadSchema(store as IDatabaseProducerStore)
      appendPropertyToSchema(readSchema, payload)

      console.log('readSchema', readSchema)

      return false
   },

   [ModelEventTypes.SetProperty]: (store, payload) => {
      return false
   },

   [ModelEventTypes.DeleteProperty]: (store, payload) => {
      return false
   },
}
