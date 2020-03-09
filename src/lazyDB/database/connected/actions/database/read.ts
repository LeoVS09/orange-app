import { EventReducer, ModelEventInnerPayload } from '@/lazyDB/core/types'
import { ModelEventReadPayload } from '@/lazyDB/database/events'
import {
  schemaToQueryFields, removeGetEventsFromMemory, dispatchReadSuccess, dispatchReadFailure
} from './utils'
import { fetchListOrEntity } from './api'
import { getInnerInnerPayload, getInnerPayload } from './types'

const read: EventReducer<ModelEventInnerPayload<ModelEventInnerPayload<ModelEventReadPayload>>> = async ({ dispatcher }, payload) => {

  const readPayload = getInnerInnerPayload(payload)
  if (!readPayload.readSchema) {
    console.error('read payload', readPayload)
    throw new Error('Read payload not have read schema')
  }
  const inner = getInnerPayload(payload)
  const getRequest = `${payload.name as string}/${inner.name as string}/`

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
}

export default read
