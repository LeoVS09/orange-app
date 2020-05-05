import { AosEntitySchema, isSimpleType, AosFieldType } from '@/abstractObjectSchema'
import { ProducerStoreSetter } from '@/lazyDB/core/types'
import { isProducer, getStore } from '@/lazyDB/core/common'
import { ISetLinkedEntity } from './types'
import { getFieldType } from './utils'
import { applyListControls } from '../list'

export const setter = (
  schema: AosEntitySchema,
  setLinkedEntity: ISetLinkedEntity = defaultSetLinkedEntity
): ProducerStoreSetter =>
  (store, name, value) => {
    const { base } = store

    const type = getFieldType(schema.fields, name as string)
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

  if (type === AosFieldType.OneToMany) {

    const store = getStore(value)
    if (extendTemporalTrap)
      store.extendTemporalTrap = extendTemporalTrap

    applyListControls(store)

    return true
  }

  console.error('Unexpected model attribute type:', type)
  return true
}
