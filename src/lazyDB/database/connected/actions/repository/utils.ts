import { ModelEventGetPropertyPayload, IProducerStore, Producerable } from '@/lazyDB/core/types'

export const isDefinedSimpleProperty = (
  { name, store: { base } }: ModelEventGetPropertyPayload
) =>
  typeof base[name as string] !== 'undefined'
