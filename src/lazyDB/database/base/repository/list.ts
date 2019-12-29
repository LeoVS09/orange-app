import {
  AbstractData,
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter,
} from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { makeTemporalTrapObject, isTemporalTrap } from '@/lazyDB/database/base/repository/temporal'
import {
  ListItemGetterReference,
  ListSource,
  nodesKey,
  NodesProducerReference,
} from '@/lazyDB/database/types'
import { SymFor } from '@/lazyDB/core/utils'
import { ArrayStringProperty, isArrayProperty } from '@/lazyDB/database/utils'

export const makeListSource = (): ListSource => ({
  // page number and on page is synthetic
  // TODO: create more clean pagination logic
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

export const setter: ProducerStoreSetter = ({ base, extendTemporalTrap }, name, value) => {
  if (name !== nodesKey)
    base[name as string] = value
  else
    base[NodesProducerReference] = value

  if (!isProducer(value))
    return true

  if (name !== nodesKey)
    return true

  const nodesStore = getStore(value) as unknown as IProducerStore<Array<any>>
  nodesStore.extendTemporalTrap = extendTemporalTrap

  nodesStore.getter = nodesGetter(base as ListSource, nodesStore)
  nodesStore.setter = nodesSetter(base as ListSource, nodesStore)

  return true
}

// Getter for array
// TODO: add typescript support for arrays
const nodesGetter = (source: ListSource, _: IProducerStore<Array<any>>): ProducerStoreGetter<Array<any>> =>
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
      console.error('LIst not have get item hook')
      return
    }

    return getItem(source, index as number)
  }

const nodesSetter = (_: ListSource, store: IProducerStore<Array<any>>): ProducerStoreSetter<Array<any>> =>
  ({ base }, name, value) => {
    base[name as unknown as number] = value

    if (!isTemporalTrap(value))
      return true

    const { extendTemporalTrap } = store
    // This hack allow make temporal trap work as repository object
    if (extendTemporalTrap) {
      const valueStore = getStore(value)
      extendTemporalTrap(valueStore)
    }

    return true
  }

const isNeedProduceTrapForSlice = (source: ListSource, base: Array<any>, args: Array<any>) =>
  !base.length && Math.abs(args[0] - args[1]) > 0 && !!source[NodesProducerReference]

const arrayMethodWrapper = (source: ListSource, base: Array<any>, index: ArrayStringProperty) =>
  (...args: Array<any>) => {
    console.log('nodes property', index, args, base)

    if (index === 'slice' && isNeedProduceTrapForSlice(source, base, args))
      return mockSliceArrayTrap(source)

    if (index === 'map' && !base.length)
      return mockMapArrayTrap(source, args)

    // traps for defined function is end
    // down wrappers for real working function

    let realDataArray = base

    const getItem = source[ListItemGetterReference]
    if (getItem)
      realDataArray = base.map((_, i) => getItem(source, i))
    else
      console.warn('List not have getItem hook', source, base, index)

    // @ts-ignore
    const result = realDataArray[index](...args)
    console.log('nodes property', index, args, 'result', result)
    return result
  }

const mockSliceArrayTrap = (source: ListSource) => {
  console.log('slice from array', source[NodesProducerReference])

  // @ts-ignore
  const result = source[NodesProducerReference][0]
  console.log('slice from array result', result)
  return [result]
}

const mockMapArrayTrap = (source: ListSource, args: Array<any>) => {
  console.log('produce trap for map')

  // @ts-ignore
  const trap = source[NodesProducerReference][0]

  // @ts-ignore
  return [trap].map(...args)
}

export interface ListSourceData {
  nodes: Array<AbstractData>
  totalCount: number | null
}

export const isListSourceData = (source: any): source is ListSourceData => {
  if (typeof source !== 'object')
    return false

  if (!source.nodes || !Array.isArray(source.nodes))
    return false

  return typeof source.totalCount === 'number'
}
