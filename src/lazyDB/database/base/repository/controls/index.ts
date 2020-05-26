import { IProducerStore } from '@/lazyDB/core/types'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectSchema'
import { ApplyRepositoryControlsOptions, GetFieldType } from './types'
import getter from './getter'
import setter from './setter'

export * from './types'

export const applyRepositoryControls = (
  store: IProducerStore<any, any>,
  {
    getFieldType,
    getLinkedEntity,
    setLinkedEntity
  }: ApplyRepositoryControlsOptions
) => {
  store.getter = getter(getFieldType, getLinkedEntity)
  store.setter = setter(getFieldType, setLinkedEntity)

  store.dispatcher.getPropertyType = name => {
    const type = getFieldType(name as string)

    if (!type)
      return AosFieldType.Any

    return type
  }

  // make temporal trap in list work as repository object
  // This must be setted for repository and table, they all create list in differrent situations
  store.extendTemporalTrap = trapStore =>
    applyRepositoryControls(trapStore, { getFieldType })
}
