import { AosSchema, isRelationsAosField } from '@/abstractObjectSchema'
import { TableListKey } from '@/lazyDB/database/storage/table'
import { databaseClient } from '@/api/database/utils'
import { PostgraphileAdapter } from './adapter'

const adapter = new PostgraphileAdapter(databaseClient)

/**
 * Define what need to request
 * */
// TODO: possible need not define it automatically
export function fetchListOrEntity(initialName: string, targetName: string, schema: AosSchema) {
  const tableField = schema[targetName]
  if (!isRelationsAosField(tableField))
    throw new Error('Was pushed not relative table field')

  if (initialName === TableListKey)
    return adapter.entityList(targetName, tableField.schema)

  const entityField = tableField.schema[initialName]
  if (!isRelationsAosField(entityField))
    throw new Error('Was pushed not relation object field')

  return adapter.entityById(targetName, initialName, entityField.schema)
}
