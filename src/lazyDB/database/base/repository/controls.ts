import {
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter,
  EventProducer,
  ExtendTemporalTrap,
} from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { getDatabaseStore } from '@/lazyDB/database/dispatcher'
import { applyListControls, makeListSource, setter as listSetter } from './list'
import { AosFieldType, isSimpleType, AosEntitySchema } from '@/abstractObjectScheme'

export const applyRepositoryControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  getSchema?: IGetSchema,
) => {
  store.getter = getter(schema)
  store.setter = setter(schema, getSchema)
}

export const getter = (schema: AosEntitySchema): ProducerStoreGetter => ({ base }, name) => {
  const value = base[name as string]
  if (typeof value !== 'undefined')
    return value

  const type = schema.fields[name as string]
  if (!type || isSimpleType(type))
    return

  if (type === AosFieldType.OneToOne) {
    console.log('Getter One to One', name)
    return { }
  }
  if (type === AosFieldType.OneToMany)
    return makeListSource()

  console.error('Unexpected model attribute type:', type)
}

export const setter = (schema: AosEntitySchema, getSchema?: IGetSchema): ProducerStoreSetter =>
  ({ base }, name, value) => {
    base[name as string] = value

    if (!isProducer(value))
      return true

    const type = schema.fields[name as string]
    if (!type || isSimpleType(type))
      return true

    if (type === AosFieldType.OneToOne) {
      console.log('Setter One to One', name, getSchema)
      applyControlsByInnerSchema(value, name as string, getSchema)
      return true
    }

    if (type === AosFieldType.OneToMany) {
      const store = getStore(value)
      store.extendTemporalTrap = applyControlsToTrap(schema, getSchema)
      applyListControls(store)

      return true
    }

    console.error('Unexpected model attribute type:', type)
    return true
  }

// make temporal trap in list work as repository object
// This must be setted for repository and table, they all create list in differrent situations
export const applyControlsToTrap = (schema: AosEntitySchema, getSchema?: IGetSchema): ExtendTemporalTrap =>
  (trap) => {

    console.log('applyControlsToTrap', trap)
    const store = getStore(trap)

    applyRepositoryControls(store, schema, getSchema)
  }

export interface IGetSchema {
  (entity: string): AosEntitySchema | undefined
}

function applyControlsByInnerSchema(value: EventProducer, name: string, getSchema?: IGetSchema) {
  if (!getSchema)
    return

  const schema = getSchema(name)
  if (!schema)
    return

  const store = getDatabaseStore(value)
  applyRepositoryControls(store, schema, getSchema)
}
