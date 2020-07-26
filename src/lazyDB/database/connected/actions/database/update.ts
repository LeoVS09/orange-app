import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'; import { ModelEventUpdatePayload } from '@/lazyDB/database/events'
import { compudeStoreParents, FieldToken } from '@/lazyDB/core/aos'
import postgraphile from '@/lazyDB/adapters/postgraphile'
import { ModelEventSetPropertyPayload, ModelEvent } from '@/lazyDB/core/types'
import { ChangedFields } from '@/lazyDB/adapters/postgraphile/adapter'
import {
  appendSetEventsToPropertyCategory,
  byTime,
  SetEventsByProperty
} from '@/lazyDB/core/optimisation/zipper'
import { AosSchema, isRelationsAosField } from '@/abstractObjectSchema'
import { BackendAdapter } from '@/lazyDB/adapters/backend'
import { isListKey } from '@/lazyDB/database/storage/table'

type UpdateReducer = DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventUpdatePayload<IDatabaseModelProducerStore>>

const last = <T>(list: Array<T>): T => list[list.length - 1]

export function setEventsToUpdatedFields(sets: Array<ModelEvent<ModelEventSetPropertyPayload>>): ChangedFields {
  const splited = sets
    .sort(byTime)
    .reduce(appendSetEventsToPropertyCategory, {} as SetEventsByProperty)

  const result: ChangedFields = {}
  for (const key of Object.keys(splited))
    result[key] = last(splited[key]).payload.newValue

  return result
}

export const update: UpdateReducer = async (root, { payload: { store, sets } }, control) => {
  const { schema } = store
  if (!schema) {
    console.error('update producer not have read schema', { store, sets })
    throw new Error('Update payload not have read schema')
  }

  const [{ name: key }, { name: entity }] = [...compudeStoreParents(store)] as Array<FieldToken<string>>

  const changedFields = setEventsToUpdatedFields(sets)

  console.log('[UpdateActiont] generate request for', `${key}/${entity}/`, 'changedFields', changedFields)

  const data = await updateEntity(postgraphile, {
    key,
    entityName: entity,
    schema,
    changedFields
  })
  console.log('[UpdateActiont] response', data)

  // Will set data and remove all set and get events for which data was received
  Object.assign(control, data)

  return true
}

export default update

export interface UpdateEntityProps {
  key: string,
  entityName: string,
  schema: AosSchema,
  changedFields: ChangedFields
}

export function updateEntity(
  adapter: BackendAdapter,
  {
    key,
    schema,
    entityName,
    changedFields
  }: UpdateEntityProps
) {
  if (isListKey(key))
    throw new Error('Cannot update list')

  const tableField = schema[entityName]
  if (!isRelationsAosField(tableField))
    throw new Error('Was pushed not relative table field')

  const entityField = tableField.schema[key]
  if (!isRelationsAosField(entityField))
    throw new Error('Was pushed not relation object field')

  return adapter.updateEntity(entityName, key, entityField.schema, changedFields)
}
