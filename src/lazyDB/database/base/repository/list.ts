import { IProducerStore, ProducerStoreGetter, ProducerStoreSetter } from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { makeTemporalTrapObject } from '@/lazyDB/database/base/repository/temporal'
import {
  ListItemGetterReference, ListSource, nodesKey, NodesProducerReference,
} from '@/lazyDB/database/types'
import { SymFor } from '@/lazyDB/core/utils'
import { ArrayStringProperty, isArrayProperty } from '@/lazyDB/database/utils'

export const makeListSource = (): ListSource => ({
  pageNumber: 1,
  onPage: 10,

  totalCount: null,
  // nodes list storing only id
  [nodesKey]: [],

  // Nodes producer stored
  [NodesProducerReference]: null,

  [ListItemGetterReference]: null,

  get maxPageNumber() {
    if (!this.onPage || !this.totalCount)
      return null

    return this.totalCount / this.onPage
  },
})

export function applyListControls(store: IProducerStore) {
  store.getter = getter
  store.setter = setter
}

export const getter: ProducerStoreGetter = ({ base }, name) => {
  if (name !== nodesKey)
    return base[name as string]

  if (base[NodesProducerReference])
    return base[NodesProducerReference]

  return base[name]
}

export const setter: ProducerStoreSetter = ({ base }, name, value) => {
  if (name !== nodesKey)
    base[name as string] = value
  else
    base[NodesProducerReference] = value

  if (!isProducer(value))
    return true

  if (name !== nodesKey)
    return true

  const nodesStore = getStore(value) as unknown as IProducerStore<Array<any>>

  nodesStore.getter = nodesGetter(base as ListSource)

  return true
}

// Getter for array
// TODO: add typescript support for arrays
const nodesGetter = (source: ListSource): ProducerStoreGetter<Array<any>> =>
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
    if (!getItem)
      return

    return getItem(source, index as number)
  }

const isNeedProduceTrapForSlice = (source: ListSource, base: Array<any>, args: Array<any>) =>
  !base.length && Math.abs(args[0] - args[1]) > 0 && !!source[NodesProducerReference]

const arrayMethodWrapper = (source: ListSource, base: Array<any>, index: ArrayStringProperty) =>
  (...args: Array<any>) => {
    console.log('nodes property', index, args)

    if (index === 'slice' && isNeedProduceTrapForSlice(source, base, args)) {
      console.log('slice from array', source[NodesProducerReference])

      // @ts-ignore
      const result = source[NodesProducerReference][0]
      console.log('slice from array result', result)
      return [result]
    }

    // @ts-ignore
    return base[index](...args)
  }
