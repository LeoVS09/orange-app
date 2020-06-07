import { Producerable, EventProducer, IProducerStore } from '@/lazyDB/core/types'
import { AosEntitySchemaStorage, AosEntitySchema, AosFieldType } from '@/abstractObjectSchema'
import { isProducer, getStore } from '@/lazyDB/core/common'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'
import { ISetLinkedEntity, applyRepositoryControls, GetFieldType } from '../repository/controls'
import { getTableNameByField } from './utils'
import { switchStoreToDatabaseStore } from '../../dispatcher'
import { applyListControls } from '../repository/list'
import { genGetFieldType } from '../getFieldType'

export const applyDatabaseControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  getSchema: IGetSchema,
  setEntity: ISetEntity
) => {

  const setLinkedEntity = genSetLinkedEntity(schema, getSchema, setEntity)
  const getFieldType = genGetFieldType(schema.fields)

  applyRepositoryControls(store, { getFieldType, setLinkedEntity })
}

export interface IGetSchema {
  (entity: string, type: AosFieldType): AosEntitySchema
}

export interface ISetEntity<T extends Producerable = Producerable> {
  (store: IProducerStore<T>, entity: string, type: AosFieldType, data: T): EventProducer<T>
}

/**
 * Generate setter hook,
 * which will called when someone try set data to linked entity field
 * @param schema - schema of model for which applied hook
 * @param getSchema - getter for linked entity schema
 * @param setEntity - hook for set entity into database
 */
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

      const getFieldType = genGetFieldType(entitySchema.fields)

      const entityStore = switchStoreToDatabaseStore(value)
      applyRepositoryControls(entityStore, { getFieldType, setLinkedEntity })

      return true
    }

    if (type === AosFieldType.OneToMany) {

      const listStore = getStore(value)
      if (!listStore)
        throw new Error('List store for given entity does not exist')

      const getFieldType = genGetFieldType(schema.fields)

      listStore.extendTemporalTrap = trapStore =>
        applyRepositoryControls(trapStore, { getFieldType, setLinkedEntity })

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
