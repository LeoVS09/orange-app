import { IDatabaseModelProducerStore } from '../../../types'
import { AosSchema } from '@/abstractObjectScheme'
import { ModelEventGetPropertyPayload, IProducerStore, AbstractData } from '@/lazyDB/core/types'

export function getOrCreateReadSchema(store: IDatabaseModelProducerStore): AosSchema {
  const { readSchema } = store
  if (readSchema)
    return readSchema

  return store.readSchema = {}
}

export const isDefinedSimpleProperty = (
  { base }: IProducerStore<AbstractData>,
  { name, inner }: ModelEventGetPropertyPayload,
) =>
  !inner && typeof base[name as string] !== 'undefined'
