import {
  AbstractData,
  EventReducersMap,
  ModelEventGetPropertyPayload,
  IProducerStore,
  ModelEventInnerPayload,
} from '@/lazyDB/core/types'
import { lastObjectPropertyName } from '@/lazyDB/database/utils'
import { appendPropertyToSchema } from '@/lazyDB/database/readSchema'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import {
  ModelEventTypes,
  ReadEventPayload,
  ReadFailureEventPayload,
  ModelEventReadPayload,
} from '@/lazyDB/database/events'
import { dateToStringFormatter } from '@/lazyDB/utils'
import { generateQueryEntityById, QueryField, generateQueryList } from '@/lazyDB/connectors/queryMapper'
import { databaseClient } from '@/api/database/utils'
import { TableListKey } from '../storage/table'
import { AosSchema, isSimpleAosField } from '@/abstractObjectScheme'

const api = {
  async fetch(entity: string, id: string, schema: AosSchema) {
    // TODO: schema not generated for internal nodes objects
    console.log('read schema', schema)

    const fields = schemaToQueryFields(schema)
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

  async list(entity: string, schema: AosSchema) {
    // TODO: schema not generated for internal nodes objects
    console.log('read schema for list', schema)

    const fields = schemaToQueryFields(schema)
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
  [ModelEventTypes.Read]: async ({ dispatcher }, payload: ModelEventInnerPayload<ModelEventInnerPayload<ModelEventReadPayload>>) => {
    // TODO: make guard
    if (!payload.inner)
      throw new Error('Not have inner payload')

    // TODO: make guard
    if (!payload.inner.inner)
      throw new Error('Not have inner inner payload')

    // TODO: make function
    const readPayload = payload.inner.inner as ModelEventReadPayload
    if (!readPayload.readSchema) {
      console.error('read payload', readPayload)
      throw new Error('Read payload not have read schema')
    }
    const getRequest = `${payload.name as string}/${payload.inner.name as string}/`

    try {
      console.log(getRequest, schemaToQueryFields(readPayload.readSchema))

      const response = await fetchListOrEntity(payload)
      console.log('read response', response)

      removeGetEventsFromMemory(readPayload)

      dispatchReadSuccess(readPayload, response)
    } catch (err) {
      dispatchReadFailure(readPayload, err)
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

function getOrCreateReadSchema(store: IDatabaseModelProducerStore): AosSchema {
  const { readSchema } = store
  if (readSchema)
    return readSchema

  return store.readSchema = {}
}

// TODO: multiple types of object schema, need better solution
export function schemaToQueryFields(schema: AosSchema): Array<string | QueryField> {
  const keys = Object.keys(schema)

  return keys.map((key) => {
    const field = schema[key]
    if (isSimpleAosField(field))
      return key

    return {
      entity: key,
      type: field.type,
      fields: schemaToQueryFields(field.schema),
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

