import { IProducerStore } from '@/lazyDB/core/types'
import { AosEntitySchema } from '@/abstractObjectScheme'
import { ApplyRepositoryControlsOptions } from './types'
import getter from './getter'
import setter from './setter'

export * from './types'

export const applyRepositoryControls = (
  store: IProducerStore,
  schema: AosEntitySchema,
  {
    getLinkedEntity,
    setLinkedEntity
  }: ApplyRepositoryControlsOptions = {}
) => {
  store.getter = getter(schema, getLinkedEntity)
  store.setter = setter(schema, setLinkedEntity)

  // make temporal trap in list work as repository object
  // This must be setted for repository and table, they all create list in differrent situations
  store.extendTemporalTrap = (trapStore) =>
    applyRepositoryControls(trapStore, schema)
}
