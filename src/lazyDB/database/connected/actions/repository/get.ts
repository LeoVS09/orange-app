import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import {
  getOrCreateSchema,
  appendEventToSchema,
  TransformTokensList,
  FieldToken
} from '@/lazyDB/database/aos'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { isWasChaged } from '@/lazyDB/receipes/trackChanges'
import { requiredFields } from '@/lazyDB/constants'
import { AosFieldType } from '@/abstractObjectSchema'
import { TableListKey } from '@/lazyDB/database/storage/table'
import { isDefinedSimpleProperty } from './utils'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '../../../types'

const defaultAdditionalFields = requiredFields.map(field => ({ name: field, type: AosFieldType.Any }))

const last = <T>(list: Array<T>): T => list[list.length - 1]

/**
 * add additional fields on entity and remove service tokens
 */
export const transformTokens = (additionalFields: Array<FieldToken>): TransformTokensList => list => {
  // remove table list field,
  // it used by lazyDb as service name,
  // not need in request schema
  const withoutServiceTokens = list.filter(({ name }) => name !== TableListKey)

  if (last(withoutServiceTokens).type === AosFieldType.OneToMany)
    return withoutServiceTokens

  // add required fields,
  // like id for lazyDb service needs
  return [...withoutServiceTokens, ...additionalFields]
}

const get: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventGetPropertyPayload> = (store, { payload }) => {
  console.log('repositoryReducers', 'GetProperty', 'event:', payload, 'store:', store)
  if (isExcludeProperty(store, payload))
    return true

  if (isDefinedSimpleProperty(payload))
    return true

  const schema = getOrCreateSchema(store)

  const isChanged = isWasChaged(
    schema,
    trackable => appendEventToSchema({
      schema: trackable,
      event: payload,
      transformTokens: transformTokens(defaultAdditionalFields)
    })
  )

  // if action was not change anything
  // then it possible was already done, or not have any impact value
  // so not need store it in memory
  return !isChanged
}

export default get
