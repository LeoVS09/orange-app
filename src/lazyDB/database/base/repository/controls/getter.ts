import { AosEntitySchema, isSimpleType, AosFieldType } from '@/abstractObjectSchema'
import { ProducerStoreGetter } from '@/lazyDB/core/types'
import { IGetLinkedEntity, GetFieldType } from './types'
import { makeListSource } from '../list'

export const getter = (
  getFieldType: GetFieldType,
  getLinkedEntity: IGetLinkedEntity = defaultGetLinkedEntity
): ProducerStoreGetter =>
  (store, name) => {
    const { base } = store
    const value = base[name as string]
    if (typeof value !== 'undefined')
      return value

    const type = getFieldType(name as string)
    if (!type || isSimpleType(type))
      return

    return getLinkedEntity(store, name as string, type)
  }

export default getter

const defaultGetLinkedEntity: IGetLinkedEntity = (store, name, type) => {
  if (type === AosFieldType.OneToOne) {
    console.log('Getter One to One', name)
    return {}
  }

  if (type === AosFieldType.OneToMany)
    return makeListSource()

  console.error('Unexpected model attribute type:', name, type)
}
