import { EventReducer, ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { isExcludeProperty } from '..'
import { isDefinedSimpleProperty, getOrCreateReadSchema } from './utils'
import { appendPropertyToSchema } from '../../../readSchema'
import { IDatabaseModelProducerStore } from '../../../types'

const get: EventReducer<ModelEventGetPropertyPayload> = (store, payload) => {
  console.log('repositoryReducers', 'GetProperty', 'payload:', payload, 'store:', store)
  if (isExcludeProperty(store as IDatabaseModelProducerStore, payload))
    return true

  if (isDefinedSimpleProperty(store, payload))
    return true

  const readSchema = getOrCreateReadSchema(store as IDatabaseModelProducerStore)

  const isAppended = appendPropertyToSchema(readSchema, payload)
  console.log('repositoryReducers', 'readSchema:', readSchema, 'event:', payload, 'isAppended:', isAppended)
  if (!isAppended)
    return true

  return false
}

export default get
