import {
  AbstractData,
  EventReducersMap,
  ModelEventGetPropertyPayload,
  IProducerStore,
} from '@/lazyDB/core/types'
import { lastObjectPropertyName } from '@/lazyDB/database/utils'
import { ModelReadSchema } from '@/lazyDB/types'
import { appendPropertyToSchema } from '@/lazyDB/database/readSchema'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import {
  ModelEventTypes,
  ReadEventPayload,
  ReadFailureEventPayload,
  ModelEventReadPayload,
} from '@/lazyDB/database/events'
import { dateToStringFormatter, isSchemaField, wait } from '@/lazyDB/utils'
import { generateQueryEntityById, QueryField, generateQueryList } from '@/lazyDB/connectors/queryMapper'
import { databaseClient } from '@/api/database/utils'
import { TableListKey } from '../storage/table'

const api = {
  async fetch(entity: string, id: string, readSchema: ModelReadSchema) {
    // TODO: schema not generated for internal nodes objects
    console.log('read schema', readSchema)

    const fields = schemaToQueryFields(readSchema)
    console.log('read schema fields', fields)

    const { query, name } = generateQueryEntityById(entity, fields)
    console.log('read schema query', query)

    const { data, errors } = await databaseClient.query({
      query,
      variables: { id },
    })

    if (errors) {
      console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
      throw new Error(`Error on request${errors.toString()}`)
    }

    console.log('data result fetched', data)

    const formated = dateToStringFormatter(data)

    return formated[name]
  },

  async list(entity: string, readSchema: ModelReadSchema) {
    // TODO: schema not generated for internal nodes objects
    console.log('read schema for list', readSchema)

    const fields = schemaToQueryFields(readSchema)
    console.log('read schema fields', fields)

    const { query, name } = generateQueryList(entity, fields)
    console.log('read schema query', query)

    const { data, errors } = await databaseClient.query({
      query,
    })

    if (errors) {
      console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
      throw new Error(`Error on request${errors.toString()}`)
    }

    console.log('data result fetched', data)

    const formated = dateToStringFormatter(data)

    return formated[name]
  },
}

export function isExcludeProperty({ excludeProperties }: IDatabaseModelProducerStore, payload: ModelEventGetPropertyPayload) {
  if (!excludeProperties)
    return false

  const prop = lastObjectPropertyName(payload)

  return excludeProperties.includes(prop)
}

const removeGetEventsFromMemory = ({ store, gets }: ReadEventPayload) => {
  const { memory } = store

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

const fetchListOrEntity = (payload: any) => {
  if (payload.inner.name === TableListKey)
    return api.list(payload.name, payload.inner.inner.readSchema)

  return api.fetch(payload.name, payload.inner.name, payload.inner.inner.readSchema)
}

export const databaseReducers: EventReducersMap = {
  [ModelEventTypes.GetProperty]: (store, payload) => {
    if (isExcludeProperty(store as IDatabaseModelProducerStore, payload))
      return true

    return false
  },

  [ModelEventTypes.SetProperty]: (store, payload) => false,

  [ModelEventTypes.DeleteProperty]: (store, payload) => false,

  // Add ts support for inner read payload
  [ModelEventTypes.Read]: async ({ dispatcher }, payload) => {
    const getRequest = `${payload.name}/${payload.inner.name}/`
    try {
      console.log(getRequest, schemaToQueryFields(payload.inner.inner.readSchema))

      const response = await fetchListOrEntity(payload)
      console.log('read response', response)

      removeGetEventsFromMemory(payload.inner.inner)

      dispatchReadSuccess(payload.inner.inner, response)
    } catch (err) {
      dispatchReadFailure(payload.inner.inner, err)
    }

    return true
  },

  [ModelEventTypes.ReadSuccess]: (_, payload) => {
    const { data, store } = payload.inner.inner
    const { base } = store

    console.log('read success data', data)

    Object.keys(data)
      .forEach((key) => {
        if (!isObject(data[key]) || isDate(data[key])) {
          base[key] = data[key]
          return
        }

        const value = data[key]
        // TODO: add intellectual deep set
        Object.keys(value).forEach((valueKey) => {
          base[key][valueKey] = value[valueKey]
        })
      })

    console.log('ModelEventTypes.ReadSuccess', base, data)

    return true
  },

  [ModelEventTypes.ReadFailure]: ({ base }, { error }: ReadFailureEventPayload) => {
    console.error(base, error)
    // TODO: handle error
    return false
  },
}

const isObject = (value: any): value is Object => typeof value === 'object'
const isDate = (value: any): value is Date => value instanceof Date

function getOrCreateReadSchema(store: IDatabaseModelProducerStore): ModelReadSchema {
  const { readSchema } = store
  if (readSchema)
    return readSchema

  return store.readSchema = {}
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

const isDefinedSimpleProperty = (
  { base }: IProducerStore<AbstractData>,
  { name, inner }: ModelEventGetPropertyPayload,
) =>
  !inner
  && typeof base[name as string] !== 'undefined'

export const repositoryReducers: EventReducersMap = {
  [ModelEventTypes.GetProperty]: (store, payload) => {
    if (isExcludeProperty(store as IDatabaseModelProducerStore, payload))
      return true

    if (isDefinedSimpleProperty(store, payload))
      return true

    const readSchema = getOrCreateReadSchema(store as IDatabaseModelProducerStore)

    const isAppended = appendPropertyToSchema(readSchema, payload)
    console.log('readSchema:', readSchema, 'event:', payload, 'isAppended:', isAppended)
    if (!isAppended)
      return true

    return false
  },

  [ModelEventTypes.SetProperty]: (store, payload) => false,

  [ModelEventTypes.DeleteProperty]: (store, payload) => false,
}

