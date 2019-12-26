import {
  IProducerStore,
  EventProducer,
  ExtendTemporalTrap,
} from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { getDatabaseStore } from '@/lazyDB/database/dispatcher'
import { applyListControls, makeListSource } from '../list'
import {
  AosFieldType,
  AosEntitySchema,
} from '@/abstractObjectScheme'
import setter from './setter'
import {
  IGetSchema,
  ISetLinkedEntity,
  ApplyControlsForTrapOptions,
  IGetLinkedEntity,
} from './types'
import { getTableNameByField } from './utils'
import getter from './getter'

export * from './types'

export const applyRepositoryControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  getSchema?: IGetSchema,
) => {
  store.getter = getter(schema, defaultGetLinkedEntity)
  store.setter = setter(schema, defaultSetLinkedEntity(schema, getSchema))
}

const defaultGetLinkedEntity: IGetLinkedEntity = (store, name, type) => {
  if (type === AosFieldType.OneToOne) {
    console.log('Getter One to One', name)
    return {}
  }

  if (type === AosFieldType.OneToMany)
    return makeListSource()

  console.error('Unexpected model attribute type:', name, type)
}

const defaultSetLinkedEntity = (schema: AosEntitySchema, getSchema?: IGetSchema): ISetLinkedEntity =>
  ({ base }, name, type, value) => {

    base[name] = value
    if (!isProducer(value))
      return true

    if (type === AosFieldType.OneToOne) {

      if (!getSchema) {
        console.log('Setter one to one', name, 'not have getSchema method')
        return true
      }

      const tableName = getTableNameByField(schema.fields, name as string)
      console.log('Setter One to One, name:', name, 'table:', tableName, 'getSchema:', getSchema)

      applyControlsByInnerSchema(value, tableName, getSchema)

      return true
    }

    if (type === AosFieldType.OneToMany) {

      const store = getStore(value)
      store.extendTemporalTrap = applyControlsForTrap({ schema, getSchema })
      applyListControls(store)

      return true
    }

    console.error('Unexpected model attribute type:', type)
    return true
  }

function applyControlsByInnerSchema(value: EventProducer, name: string, getSchema: IGetSchema) {
  const schema = getSchema(name)
  if (!schema)
    return

  const store = getDatabaseStore(value)
  applyRepositoryControls(store, schema, getSchema)
}

// make temporal trap in list work as repository object
// This must be setted for repository and table, they all create list in differrent situations
export const applyControlsForTrap = (options: ApplyControlsForTrapOptions): ExtendTemporalTrap =>
  (trap) => {

    console.log('applyControlsToTrap', trap)
    const store = getStore(trap)

    applyRepositoryControls(store, options.schema, options.getSchema)
  }

