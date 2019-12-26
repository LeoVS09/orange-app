import { AosEntitySchema, isSimpleType, AosFieldType } from '@/abstractObjectScheme'
import { IGetLinkedEntity } from './types'
import { ProducerStoreGetter } from '@/lazyDB/core/types'
import { getFieldType } from './utils'
import { makeListSource } from '../list'

export const getter = (
  schema: AosEntitySchema,
  getLinkedEntity: IGetLinkedEntity = defaultGetLinkedEntity,
): ProducerStoreGetter =>
  (store, name) => {
    const { base } = store
    const value = base[name as string]
    if (typeof value !== 'undefined')
      return value

    const type = getFieldType(schema.fields, name as string)
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
