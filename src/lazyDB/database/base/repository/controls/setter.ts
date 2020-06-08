import { AosEntitySchema, isSimpleType, AosFieldType } from '@/abstractObjectSchema'
import { ProducerStoreSetter } from '@/lazyDB/core/types'
import { isProducer, getStore } from '@/lazyDB/core/common'
import { ISetLinkedEntity, GetFieldType } from './types'
import { applyListControls, isListSource } from '../list'

export const setter = (
  getFieldType: GetFieldType,
  setLinkedEntity: ISetLinkedEntity = defaultSetLinkedEntity
): ProducerStoreSetter =>
  (store, name, value) => {
    const { base } = store

    const type = getFieldType(name as string)
    if (!type || isSimpleType(type)) {
      base[name as string] = value
      return true
    }

    return setLinkedEntity(store, name as string, type, value)
  }

export default setter

const defaultSetLinkedEntity: ISetLinkedEntity = ({ base, extendTemporalTrap }, name, type, value) => {

  base[name] = value

  if (type === AosFieldType.OneToOne)
    return true

  if (!isProducer(value))
    return true

  if (type === AosFieldType.Service) {

    const store = getStore(value)!
    if (isListSource(store.base)) {

      if (extendTemporalTrap)
        store.extendTemporalTrap = extendTemporalTrap

      applyListControls(store)
      return true
    }

    console.error('Was try set not list source in service field', name, type, value)

    return true
  }

  console.error('Unexpected model attribute type:', type)
  return true
}
