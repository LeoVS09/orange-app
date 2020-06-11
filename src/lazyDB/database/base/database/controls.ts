import { Producerable, EventProducer, IProducerStore } from '@/lazyDB/core/types'
import { AosEntitySchemaStorage, AosEntitySchema, AosFieldType } from '@/abstractObjectSchema'
import { isProducer, getStore } from '@/lazyDB/core/common'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'
import { ISetLinkedEntity, applyRepositoryControls, GetFieldType } from '../repository/controls'
import { getTableNameByField } from './utils'
import { switchStoreToDatabaseStore } from '../../dispatcher'
import { applyListControls, isListSourceData } from '../repository/list'
import { genGetFieldType } from '../getFieldType'
import {
  ListSource,
  DatabaseTableMap,
  ListItemGetterReference,
  ListItemSetterReference,
  DatabaseTable
} from '../../types'
import { listItemGetter, listItemSetter, TableStoreReference } from '../../storage/table'
import { saveEntity } from './saveEntity'
import { getEntityPrimaryKey } from '../repository/Repository'

export const applyDatabaseControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  setLinkedEntity: ISetLinkedEntity
) => {
  const getFieldType = genGetFieldType(schema.fields)

  applyRepositoryControls(store, { getFieldType, setLinkedEntity })
}

export interface IGetSchema {
  (tableName: string): AosEntitySchema
}

export interface IGetTable {
  (name: string): DatabaseTable
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
  getTable: IGetTable
): ISetLinkedEntity => {
  const setLinkedEntity: ISetLinkedEntity = (store, name, type, value) => {
    console.log('[SetLinkedEntity] set linked entity', store, name, type, value)
    const { base, proxy } = store
    const tableName = getTableNameByField(schema.fields, name as string)
    const table = getTable(tableName)

    if (!isProducer(value)) {
      // There mean, added new entity, possible on read success,
      // will save it to database and wrap as producer
      if (type === AosFieldType.OneToOne) {
        const entitySchema = getSchema(tableName)
        base[name] = saveEntity(value, entitySchema, table)
        return true
      }

      if (type === AosFieldType.Service) {
        if (!isListSourceData(value))
          throw new Error('Try set not list source to Service field')

        // will assign list source by using existed getters
        const existedListSource = proxy![name]
        Object.assign(existedListSource, value)

        return true
      }

      console.warn('Unexpected data type for', name, 'type', type, 'value', value, 'not will assign')
      return true
    }

    base[name] = value

    if (type === AosFieldType.OneToOne) {
      console.log('[SetLinkedEntity] Setter One to One, table:', tableName, 'getSchema:', getSchema)

      const entitySchema = getSchema(tableName)
      if (!entitySchema) {
        console.warn('Try set entity which not have schema', name, 'for', store)
        return true
      }

      setupNewEntity({ entitySchema, value, setLinkedEntity })
      return true
    }

    if (type === AosFieldType.Service) {

      const serviceStore = getStore(value)!

      if (isListSourceData(serviceStore.base)) {
        setupListSource(serviceStore, schema, setLinkedEntity, table)
        return true
      }

      console.warn('[SetLinkedEntity] Unexpected service value, store:', store, 'inputs:', { name, type, value })

      return true
    }

    console.error('Unexpected model attribute type:', type)
    return true
  }

  return setLinkedEntity
}

export interface SetupNewEntityProps {
  entitySchema: AosEntitySchema
  value: EventProducer<any>,
  setLinkedEntity: ISetLinkedEntity
}

function setupNewEntity({ entitySchema, value, setLinkedEntity }: SetupNewEntityProps) {
  const getFieldType = genGetFieldType(entitySchema.fields)

  const entityStore = switchStoreToDatabaseStore(value)
  applyRepositoryControls(entityStore, { getFieldType, setLinkedEntity })
}

function setupListSource(
  store: IProducerStore<ListSource>,
  schema: AosEntitySchema,
  setLinkedEntity: ISetLinkedEntity,
  table?: DatabaseTable
) {
  const getFieldType = genGetFieldType(schema.fields)

  store.extendTemporalTrap = trapStore =>
    applyRepositoryControls(trapStore, { getFieldType, setLinkedEntity })

  applyListControls(store)

  if (!table)
    return

  const map = table[TableStoreReference]
  const { base } = store
  base[ListItemGetterReference] = listItemGetter(map)
  base[ListItemSetterReference] = listItemSetter(map, value => getEntityPrimaryKey(schema, value))
}
