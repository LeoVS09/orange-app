import { IEntityTypeSchema } from '@/lazyDB/database/types'
import {
  IProducerStore,
  ModelAttributeType,
  ProducerStoreGetter,
  ProducerStoreSetter,
  EventProducer,
} from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { getDatabaseStore } from '@/lazyDB/database/dispatcher'
import { applyListControls, makeListSource, setter as listSetter } from './list'

export const applyRepositoryControls = (
  store: IProducerStore,
  schema: IEntityTypeSchema,
  getSchema?: IGetSchema,
) => {
  store.getter = getter(schema)
  store.setter = setter(schema, getSchema)
}

export const getter = (schema: IEntityTypeSchema): ProducerStoreGetter => ({ base }, name) => {
  const value = base[name as string]
  if (typeof value !== 'undefined')
    return value

  const type = schema[name as string]
  if (!type || type === ModelAttributeType.Simple)
    return

  if (type === ModelAttributeType.OneToOne) {
    console.log('Getter One to One', name)
    return { }
  }
  if (type === ModelAttributeType.OneToMany)
    return makeListSource()

  console.error('Unexpected model attribute type:', type)
}

export const setter = (schema: IEntityTypeSchema, getSchema?: IGetSchema): ProducerStoreSetter =>
  ({ base }, name, value) => {
    base[name as string] = value

    if (!isProducer(value))
      return true

    const type = schema[name as string]
    if (!type || type === ModelAttributeType.Simple)
      return true

    if (type === ModelAttributeType.OneToOne) {
      console.log('Setter One to One', name, getSchema)
      applyControlsByInnerSchema(value, name as string, getSchema)
      return true
    }

    if (type === ModelAttributeType.OneToMany) {
      const store = getStore(value)
      applyListControls(store)

      return true
    }

    console.error('Unexpected model attribute type:', type)
    return true
  }

export interface IGetSchema {
  (entity: string): IEntityTypeSchema | undefined
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
