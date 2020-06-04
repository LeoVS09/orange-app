import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import {
  getOrCreateSchema,
  appendEventToSchema,
  TransformTokensList,
  FieldToken
} from '@/lazyDB/database/aos'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { isMutated } from '@/lazyDB/recipes/trackChanges/isMutated'
import { requiredFields } from '@/lazyDB/constants'
import { AosFieldType } from '@/abstractObjectSchema'
import { TableListKey } from '@/lazyDB/database/storage/table'
import { isDefinedSimpleProperty } from './utils'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '../../../types'
import { transformTokensForGet } from './transformTokens'

const defaultAdditionalFields = requiredFields.map(field => ({ name: field, type: AosFieldType.Any }))

const get: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventGetPropertyPayload> = (store, { payload }) => {
  console.log('[RepositoryReducers]', 'GetProperty', 'event:', payload, 'store:', store)
  if (isExcludeProperty(store, payload))
    return true

  if (isDefinedSimpleProperty(payload))
    return true

  const schema = getOrCreateSchema(store)

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
