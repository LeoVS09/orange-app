import { AosParser } from '@/lazyDB/core/aos'
import { SetupNewEntityProps } from './database/controls'
import { genGetFieldType } from './getFieldType'
import { switchStoreToDatabaseStore } from '../dispatcher'
import { applyRepositoryControls } from './repository/controls'
import { IDatabaseModelProducerStore } from '../types'

export function setupNewEntity({ entitySchema, value, setLinkedEntity }: SetupNewEntityProps) {
  const getFieldType = genGetFieldType(entitySchema.fields)

  const entityStore = switchStoreToDatabaseStore(value)
  applyRepositoryControls(entityStore, { getFieldType, setLinkedEntity })
  setAlreadyExistsFieldsToSchema(entityStore)
}

/** will set fields, which already exists in data, to schema */
export const setAlreadyExistsFieldsToSchema = (store: IDatabaseModelProducerStore<any, any>) => {
  const { base, schema, dispatcher } = store
  if (Array.isArray(base))
    return

  const keys = Object.keys(base)

  if (!keys.length)
    return

  const parser = new AosParser(schema!)

  for (const key of keys) {
    // TODO: need add correct dispatcher to each of new entity
    const type = dispatcher.getPropertyType(key, store)
    parser.append({ name: key, type, store }, store)
  }
}

