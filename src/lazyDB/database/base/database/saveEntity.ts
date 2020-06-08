import { Producerable, EventProducer } from '@/lazyDB/core/types'
import { AosEntitySchema } from '@/abstractObjectSchema'
import { DatabaseTable } from '../../types'
import { getEntityPrimaryKey } from '../repository/Repository'

export function saveEntity<T extends Producerable = Producerable>(value: T, entitySchema: AosEntitySchema, table: DatabaseTable): EventProducer<T> {
  const id = getEntityPrimaryKey(entitySchema, value)

  if (typeof id !== 'string') {
    console.error('Not have primary key id in value', value, 'id', id, 'schema', entitySchema)
    throw new Error('Not have primary key id in data')
  }

  table[id] = value
  // will wrap value as producer
  return table[id]
}
