import { AosEntitySchema, isSimpleType } from '@/abstractObjectScheme'
import { IGetLinkedEntity } from './types'
import { ProducerStoreGetter } from '@/lazyDB/core/types'
import { getFieldType } from './utils'

export const getter = (
  schema: AosEntitySchema,
  getLinkedEntity: IGetLinkedEntity,
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
