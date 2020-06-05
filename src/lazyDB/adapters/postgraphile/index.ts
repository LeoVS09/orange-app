import { AosSchema, isRelationsAosField } from '@/abstractObjectSchema'
import { isListKey } from '@/lazyDB/database/storage/table'
import { databaseClient } from '@/api/database/utils'
import { ModelEvent, ModelEventSetPropertyPayload } from '@/lazyDB/core/types'
import { PostgraphileAdapter, ChangedFields } from './adapter'

const adapter = new PostgraphileAdapter(databaseClient)

/**
 * Define what need to request
 * @param key - id or list key
 * @param entityName - name of entity
 * */
// TODO: possible need not define it automatically
export function fetchListOrEntity(key: string, entityName: string, schema: AosSchema) {
  const tableField = schema[entityName]
  if (!isRelationsAosField(tableField))
    throw new Error('Was pushed not relative table field')

  // Was asked list of entities
  if (isListKey(key))
    return adapter.getEntityList(entityName, tableField.schema)

  // Was asked one entity
  const entityField = tableField.schema[key]
  if (!isRelationsAosField(entityField))
    throw new Error('Was pushed not relation object field')

  return adapter.getEntityById(entityName, key, entityField.schema)
}

export interface UpdateListOrEntityProps {
    key: string,
    entityName: string,
    schema: AosSchema,
    changedFields: ChangedFields
}

export function updateEntity({
  key,
  schema,
  entityName,
  changedFields
}: UpdateListOrEntityProps) {
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
