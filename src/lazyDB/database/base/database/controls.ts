import { IProducerStore } from '@/lazyDB/core/types'
import { AosEntitySchemaStorage, AosEntitySchema, AosFieldType } from '@/abstractObjectScheme'
import { ISetLinkedEntity, applyRepositoryControls } from '../repository/controls'
import { isProducer, getStore } from '@/lazyDB/core/common'
import { getTableNameByField } from './utils'
import { getDatabaseStore } from '../../dispatcher'
import { applyListControls } from '../repository/list'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'

export const applyDatabaseControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  getSchema: IGetSchema,
) => {

  const setLinkedEntity = genSetLinkedEntity(schema, getSchema)

  applyRepositoryControls(store, schema, { setLinkedEntity })
}

export interface IGetSchema {
  (key: string): AosEntitySchema
}

export const genSetLinkedEntity = (schema: AosEntitySchema, getSchema: IGetSchema): ISetLinkedEntity =>
  ({ base }, name, type, value) => {
    base[name] = value
    if (!isProducer(value))
      return true

    // TODO: make more plain recursion, this make overflow call stack limit
    const setLinkedEntity = genSetLinkedEntity(schema, getSchema)

    if (type === AosFieldType.OneToOne) {

      const tableName = getTableNameByField(schema.fields, name as string)
      console.log('Setter One to One, name:', name, 'table:', tableName, 'getSchema:', getSchema)

      const entitySchema = getSchema(tableName)
      if (!entitySchema)
        return true

      const entityStore = getDatabaseStore(value)
      applyRepositoryControls(entityStore, entitySchema, { setLinkedEntity })

      return true
    }

    if (type === AosFieldType.OneToMany) {

      const listStore = getStore(value)
      listStore.extendTemporalTrap = trapStore =>
        applyRepositoryControls(trapStore, schema, { setLinkedEntity })

      applyListControls(listStore)

      return true
    }

    console.error('Unexpected model attribute type:', type)
    return true
  }

export const getSchemaByKey = (schemas: AosEntitySchemaStorage, key: string, type: AosFieldType): AosEntitySchema => {
  let fieldEntity = key
  if (type === AosFieldType.OneToMany)
    fieldEntity = extractEntityNameFromManyKey(key)

  return schemas[fieldEntity]
}
