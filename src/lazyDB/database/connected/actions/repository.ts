import { AosSchema } from '@/abstractObjectScheme'
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

  [ModelEventTypes.SetProperty]: () => false,

  [ModelEventTypes.DeleteProperty]: () => false,
}
