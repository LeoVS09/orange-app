import {
  ModelEventTypes, ReadFailureEventPayload, ModelEventReadPayload, ReadEventPayload,
} from '../../events'
import { schemaToQueryFields } from '.'
import {
  ModelEventInnerPayload, EventReducersMap, AbstractData, ModelEventGetPropertyPayload,
} from '@/lazyDB/core/types'
import { IDatabaseModelProducerStore } from '../../types'
import { TableListKey } from '../../storage/table'
import { api } from './api.'
import { isExcludeProperty } from './utils'

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
      console.log('databaseReducers', getRequest, schemaToQueryFields(readPayload.readSchema))

      const response = await fetchListOrEntity(payload)
      console.log('databaseReducers', 'read response', response)

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

    console.log('databaseReducers', 'read success data', data)

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

    console.log('databaseReducers', 'ModelEventTypes.ReadSuccess', base, data)

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
