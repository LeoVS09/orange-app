import {
  ListSource, ListItemGetterReference, ListItemSetterReference
} from '@/lazyDB/database/types'
import {
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter
} from '@/lazyDB/core/types'
import { isArrayProperty } from '@/lazyDB/database/utils'
import { getStore } from '@/lazyDB/core/common'
import { makeTemporalTrapObject, isTemporalTrapProducer, isTemporalTrap } from '../temporal'
import { arrayMethodWrapper } from './arrayMethodWrapper'

// Getter for array
// TODO: add typescript support for arrays
export const nodesGetter = <Store extends IProducerStore<any, any> = IProducerStore>(
  source: ListSource,
  _: IProducerStore<Array<any>>
): ProducerStoreGetter<Store> =>
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
        return base[index]
      }

      return getItem(source, index as number)
    }

export const nodesSetter = <Store extends IProducerStore<any, any> = IProducerStore>(
  source: ListSource,
  store: IProducerStore<Array<any>>
): ProducerStoreSetter<Store> =>
    ({ base }, name, value) => {

      console.log('[ListNodes] set value for nodes:', base, name, value)

      if (isTemporalTrapProducer(value)) {

        base[name as unknown as number] = value
        const { extendTemporalTrap } = store

        // This hack allow make temporal trap work as repository object
        if (extendTemporalTrap) {
          const valueStore = getStore(value)!
          extendTemporalTrap(valueStore)
        }

        console.log('[ListNodes] was set trap for nodes:', base, name, value)
        return true
      }

      const setItem = source[ListItemSetterReference]
      if (setItem)
      // in base case will return id
        value = setItem(source, name as unknown as number, value)
      else
        console.error('List not have set item hook')

      base[name as unknown as number] = value

      console.log('[ListNodes] was set value for nodes:', base, name, value)
      return true
    }
