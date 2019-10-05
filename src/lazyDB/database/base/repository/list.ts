import { IProducerStore, ProducerStoreGetter, ProducerStoreSetter } from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { makeTemporalTrapObject } from '@/lazyDB/database/base/repository/temporal'
import { ListItemGetterReference, ListSource } from '@/lazyDB/database/types'
import { SymFor } from '@/lazyDB/core/utils'
import { isArrayProperty } from '@/lazyDB/database/utils'

const nodesKey = 'nodes'
const NodesProducerReference = SymFor(`${nodesKey} producer`)

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
    if (typeof index === 'string') {

      if (!isArrayProperty(index))
      // TODO: may be need trow error
        return

      const property = base[index]
      if (typeof property !== 'function')
        return property

      return (...args: Array<any>) =>
        // @ts-ignore
        base[index](...args)
    }

    if (!base.length && base)
      return makeTemporalTrapObject()

    const getItem = source[ListItemGetterReference]
    if (!getItem)
      return

    // TODO: add support to string properties for array, like 'slice' and other

    return getItem(source, index as number)
  }

