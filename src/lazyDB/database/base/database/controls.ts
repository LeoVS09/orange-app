import { AbstractData, EventProducer, IProducerStore } from '@/lazyDB/core/types'
import { AosEntitySchemaStorage, AosEntitySchema, AosFieldType } from '@/abstractObjectScheme'
import { isProducer, getStore } from '@/lazyDB/core/common'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'
import { ISetLinkedEntity, applyRepositoryControls } from '../repository/controls'
import { getTableNameByField } from './utils'
import { getDatabaseStore } from '../../dispatcher'
import { applyListControls } from '../repository/list'

export const applyDatabaseControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  getSchema: IGetSchema,
  setEntity: ISetEntity
) => {

  const setLinkedEntity = genSetLinkedEntity(schema, getSchema, setEntity)

  applyRepositoryControls(store, schema, { setLinkedEntity })
}

export interface IGetSchema {
  (entity: string, type: AosFieldType): AosEntitySchema
}

export interface ISetEntity {
  (store: IProducerStore<AbstractData>, entity: string, type: AosFieldType, data: AbstractData): EventProducer
}

export const genSetLinkedEntity = (
  schema: AosEntitySchema,
  getSchema: IGetSchema,
  setEntity: ISetEntity
): ISetLinkedEntity => {
  const setLinkedEntity: ISetLinkedEntity = (store, name, type, value) => {
    console.log('set linked entity', store, name, type, value)
    const { base } = store
    const tableName = getTableNameByField(schema.fields, name as string)

    if (!isProducer(value)) {
      // There mean, added new entity, possible on read success
      value = setEntity(store, tableName, type as AosFieldType, value)
    }

    base[name] = value

    if (type === AosFieldType.OneToOne) {
      console.log('Setter One to One, name:', name, 'table:', tableName, 'getSchema:', getSchema)

      const entitySchema = getSchema(tableName, type)
      if (!entitySchema)
        return true

      const entityStore = getDatabaseStore(value)
      applyRepositoryControls(entityStore, entitySchema, { setLinkedEntity })

      return true
    }

    if (type === AosFieldType.OneToMany) {

      const listStore = getStore(value)
      listStore.extendTemporalTrap = (trapStore) =>
        applyRepositoryControls(trapStore, schema, { setLinkedEntity })

      applyListControls(listStore)

      return true
    }

    console.error('Unexpected model attribute type:', type)
    return true
  }

  return setLinkedEntity
}

export const getSchemaByKey = (schemas: AosEntitySchemaStorage, key: string, type: AosFieldType): AosEntitySchema => {
  let fieldEntity = key
  if (type === AosFieldType.OneToMany)
    fieldEntity = extractEntityNameFromManyKey(key)

  return schemas[fieldEntity]
}
