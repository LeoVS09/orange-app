import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import {
  getOrCreateSchema,
  appendEventToSchema,
  getAbsolutePath
} from '@/lazyDB/core/aos'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { isMutated } from '@/lazyDB/recipes/trackChanges/isMutated'
import { requiredFields } from '@/lazyDB/constants'
import { AosFieldType } from '@/abstractObjectSchema'
import { isDefinedSimpleProperty } from './utils'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '../../../types'
import { transformTokensForGet } from './transformTokens'

const defaultAdditionalFields = requiredFields.map(field => ({ name: field, type: AosFieldType.Any }))

/** Default reducer for get events produced from models */
const get: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventGetPropertyPayload> = (root, { payload }) => {
  console.log('[RepositoryReducers]', 'GetProperty', 'event:', payload, 'store:', root)
  if (isExcludeProperty(root, payload))
    return true

  if (isDefinedSimpleProperty(payload))
    return true

  console.log(`GET ${getAbsolutePath(payload.store)}.${payload.name}`)

  const schema = getOrCreateSchema(root)

  // Track if schema was changed
  // when try append new event
  const isChanged = isMutated(schema, trackable => appendEventToSchema({
    schema: trackable,
    event: payload,
    transformTokens: transformTokensForGet(defaultAdditionalFields)
  }))

  // if action was not change anything
  // then it possible was already done, or not have any impact value
  // so not need store it in memory
  return !isChanged
}

export default get
