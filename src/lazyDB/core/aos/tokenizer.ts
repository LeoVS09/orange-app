import { AosFieldType } from '@/abstractObjectSchema'
import { IProducerStore, Producerable, ParentLink } from '@/lazyDB/core/types'

/**
 * Middle respresentation token,
 * which will be transformed to `ParserToken`,
 * allow make computations and changes before parsing
 * */
export interface FieldToken<Name = PropertyKey>{
  type: AosFieldType
  name: Name
  /** Store of produced value */
  store?: IProducerStore
}

/**
 * Will return absolute properties path to root node,
 * as example for database any model by will have path, `entity-name.some-id`
 * */
export const getAbsolutePath = (store: IProducerStore): string =>
  [...compudeStoreParents(store)]
    .reverse()
    .reduce((previus, current) => `${previus}.${String(current.name)}`, '')
    .slice(1) // remove first dot

/** Build path from store to root node (or stop) */
export function* compudeStoreParents(store: IProducerStore, stop?: IProducerStore): Generator<FieldToken> {
  const { parent } = store
  if (!parent || store === stop)
    return

  yield {
    name: parent.name,
    type: getFieldType(parent),
    store
  }

  yield* compudeStoreParents(parent.store, stop)
}

/** Calcualte field link type, based on link */
export const getFieldType = ({ name, store }: ParentLink<IProducerStore>) => {
  const { dispatcher } = store
  return dispatcher.getPropertyType(name, store)
}

const getFieldTypeBasedOnField = (base: Producerable) => {
  if (Array.isArray(base))
    return AosFieldType.OneToMany

  return AosFieldType.OneToOne
}

/**
 * Will check stores upper in hierarchy, and return first on which comparator return true,
 * or his first parent in tree
 * */
export function closest(store: IProducerStore, comparator: (store: IProducerStore) => boolean): IProducerStore | undefined {
  if (comparator(store))
    return store

  const { parent } = store
  if (!parent)
    return

  return closest(parent.store, comparator)
}

/**
 * Will find store which linked to parent by give type,
 * or his first parent in tree
 * */
export const closestType = (store: IProducerStore, type: AosFieldType) =>
  closest(store, cursor => {
    const { parent } = cursor
    if (!parent)
      return false

    if (type === getFieldType(parent))
      return true

    return false
  })
