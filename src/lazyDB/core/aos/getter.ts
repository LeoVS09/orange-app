import { AosSchema } from '@/abstractObjectSchema'
import { IDatabaseModelProducerStore } from '../../database/types'

// TODO: make store class, and use this getter inside
/** Create schema for store */
export function getOrCreateSchema(store: IDatabaseModelProducerStore): AosSchema {
  const { schema } = store
  if (schema)
    return schema

  return store.schema = {}
}
