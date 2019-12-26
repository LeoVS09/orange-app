import { AosEntitySchema, isSimpleType } from '@/abstractObjectScheme'
import { ISetLinkedEntity } from './types'
import { ProducerStoreSetter } from '@/lazyDB/core/types'
import { getFieldType } from './utils'

export const setter = (
  schema: AosEntitySchema,
  setLinkedEntity: ISetLinkedEntity,
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
