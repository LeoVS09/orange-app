import { isSimpleAosField, AosSchema } from '@/abstractObjectScheme'
import { QueryField } from '@/lazyDB/connectors/queryMapper'
import { IDatabaseModelProducerStore } from '../../types'
import {
  IProducerStore, AbstractData, ModelEventGetPropertyPayload, EventReducersMap,
} from '@/lazyDB/core/types'
import { ModelEventTypes } from '../../events'
import { appendPropertyToSchema } from '../../readSchema'
import { isExcludeProperty } from './utils'

function getOrCreateReadSchema(store: IDatabaseModelProducerStore): AosSchema {
  const { readSchema } = store
  if (readSchema)
    return readSchema

  return store.readSchema = {}
}

// TODO: multiple types of object schema, need better solution
export function schemaToQueryFields(schema: AosSchema): Array<string | QueryField> {
  const keys = Object.keys(schema)

  return keys.map((key) => {
    const field = schema[key]
    if (isSimpleAosField(field))
      return key

    return {
      entity: key,
      type: field.type,
      fields: schemaToQueryFields(field.schema),
    }
  })
}

const isDefinedSimpleProperty = (
  { base }: IProducerStore<AbstractData>,
  { name, inner }: ModelEventGetPropertyPayload,
) =>
  !inner
    && typeof base[name as string] !== 'undefined'

export const repositoryReducers: EventReducersMap = {
  [ModelEventTypes.GetProperty]: (store, payload) => {
    console.log('repositoryReducers', 'GetProperty', 'payload:', payload, 'store:', store)
    if (isExcludeProperty(store as IDatabaseModelProducerStore, payload))
      return true

    if (isDefinedSimpleProperty(store, payload))
      return true

    const readSchema = getOrCreateReadSchema(store as IDatabaseModelProducerStore)

    const isAppended = appendPropertyToSchema(readSchema, payload)
    console.log('repositoryReducers', 'readSchema:', readSchema, 'event:', payload, 'isAppended:', isAppended)
    if (!isAppended)
      return true

    return false
  },

  [ModelEventTypes.SetProperty]: (store, payload) => false,

  [ModelEventTypes.DeleteProperty]: (store, payload) => false,
}
