import { EventReducer } from '@/lazyDB/core/types'
import { ModelEventReadPayload } from '@/lazyDB/database/events'
import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { DatabaseEventsPayloads } from '@/lazyDB/database/dispatcher'
import { compudeStoreParents } from '@/lazyDB/database/aos'
import {
  schemaToQueryFields,
  removeGetEventsFromMemory,
  dispatchReadSuccess,
  dispatchReadFailure
} from './utils'
import { fetchListOrEntity } from './api'

const read: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventReadPayload<IDatabaseModelProducerStore>> = async (dataBaseStore, { payload }) => {
  const { store } = payload
  const { schema } = store
  if (!schema) {
    console.error('read payload', payload)
    throw new Error('Read payload not have read schema')
  }
  // possible need stop on some moment
  const [initial, entity] = [...compudeStoreParents(store)]
  const getRequest = `${initial.name as string}/${entity.name as string}/`
  console.log('[ReadActiont] generated get request', getRequest)

  try {
    console.log('databaseReducers', getRequest, schemaToQueryFields(schema))

    const response = await fetchListOrEntity(initial.name as string, entity.name as string, schema)
    console.log('databaseReducers', 'read response', response)

    removeGetEventsFromMemory(payload)

    dispatchReadSuccess(payload, response)
  } catch (err) {
    dispatchReadFailure(payload, err)
  }

  return true
}

export default read
