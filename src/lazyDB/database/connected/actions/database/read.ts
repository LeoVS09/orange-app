import { EventReducer } from '@/lazyDB/core/types'
import { ModelEventReadPayload } from '@/lazyDB/database/events'
import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { DatabaseEventsPayloads } from '@/lazyDB/database/dispatcher'
import { compudeStoreParents } from '@/lazyDB/database/aos'
import {
  schemaToQueryFields,
  removeGetEventsFromMemory
} from './utils'
import { fetchListOrEntity } from './api'

const read: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventReadPayload<IDatabaseModelProducerStore>> = async (dataBaseStore, { payload }) => {
  const { store } = payload
  const { schema, proxy } = store
  if (!schema) {
    console.error('read payload', payload)
    throw new Error('Read payload not have read schema')
  }
  // create lazy array
  const [initial, entity] = [...compudeStoreParents(store)]
  const getRequest = `${initial.name as string}/${entity.name as string}/`
  console.log('[ReadActiont] generated get request', getRequest)

  console.log('[ReadActiont] getRequest', getRequest, schemaToQueryFields(schema))

  const data = await fetchListOrEntity(initial.name as string, entity.name as string, schema)
  console.log('[ReadActiont] read response', data)

  // need remove it outside of handler
  // probably setup it in lifecycle
  removeGetEventsFromMemory(payload)

  Object.assign(proxy, data)

  return true
}

export default read
