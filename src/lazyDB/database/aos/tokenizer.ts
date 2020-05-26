import { AosFieldType } from '@/abstractObjectSchema'
import { IProducerStore, Producerable, ParentLink } from '@/lazyDB/core/types'

export interface FieldToken {
    type: AosFieldType
    name: PropertyKey
  }

/** Build path from store to root node */
export function* compudeStoreParents(store: IProducerStore): Generator<FieldToken> {
  const { parent, base } = store
  if (!parent)
    return

  yield {
    name: parent.name,
    type: getFieldType(parent)
  }

  yield* compudeStoreParents(parent.store)
}

const getFieldType = ({ name, store }: ParentLink<IProducerStore>) => {
  const { dispatcher } = store
  return dispatcher.getPropertyType(name, store)
}

const getFieldTypeBasedOnField = (base: Producerable) => {
  if (Array.isArray(base))
    return AosFieldType.OneToMany

  return AosFieldType.OneToOne
}