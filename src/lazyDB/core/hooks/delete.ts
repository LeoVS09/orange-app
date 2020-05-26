import { IProducerStore } from '../types'
import { isExplictlyAccessPropty } from './explictly'

export function deleteProperty(store: IProducerStore, prop: PropertyKey) {
  if (isExplictlyAccessPropty(prop))
    return true

  const { base, dispatcher } = store

  // The `undefined` check is a fast path for pre-existing keys.
  if (base[prop as unknown as string] !== undefined || prop in base)
    dispatcher.delete(prop, store)

  // We not do actual delete,
  // because in some cases event cannot be handled after property deleted
  // delete base[prop]

  return true
}
