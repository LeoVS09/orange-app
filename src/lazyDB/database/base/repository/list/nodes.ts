import {
  ListSource, ListItemGetterReference, NodesProducerReference, ListItemSetterReference,
} from '@/lazyDB/database/types'
import {
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter,
} from '@/lazyDB/core/types'
import { isArrayProperty } from '@/lazyDB/database/utils'
import { makeTemporalTrapObject, isTemporalTrap } from '../temporal'
import { getStore } from '@/lazyDB/core/common'
import { arrayMethodWrapper } from './arrayMethodWrapper'

// Getter for array
// TODO: add typescript support for arrays
export const nodesGetter = (source: ListSource, _: IProducerStore<Array<any>>): ProducerStoreGetter<Array<any>> =>
  ({ base }, index) => {
    console.log('get nodes', index, 'base', base)

    const parsedIndex = Number.parseInt(index as string, 10)
    if (Number.isInteger(parsedIndex))
      index = parsedIndex

    if (typeof index === 'string') {

      if (!isArrayProperty(index))
      // TODO: may be need trow error
        return

      const property = base[index]
      if (typeof property !== 'function')
        return property

      return arrayMethodWrapper(source, base, index)
    }

    if (!base.length && base) {
      console.log('make trap in nodes')
      return makeTemporalTrapObject()
    }

    const getItem = source[ListItemGetterReference]
    if (!getItem) {
      console.error('List not have get item hook')
      return
    }

    return getItem(source, index as number)
  }

export const nodesSetter = (
  source: ListSource,
  store: IProducerStore<Array<any>>,
): ProducerStoreSetter<Array<any>> =>
  ({ base }, name, value) => {

    console.log('[ListNodes] set value for nodes:', base, name, value)

    if (isTemporalTrap(value)) {
      base[name as unknown as number] = value
      const { extendTemporalTrap } = store
      // This hack allow make temporal trap work as repository object
      if (extendTemporalTrap) {
        const valueStore = getStore(value)
        extendTemporalTrap(valueStore)
      }
    }

    const setItem = source[ListItemSetterReference]
    if (setItem)
      value = setItem(source, name as unknown as number, value)
    else
      console.error('List not have set item hook')

    base[name as unknown as number] = value

    return true
  }
