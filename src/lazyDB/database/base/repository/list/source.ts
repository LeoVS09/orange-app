import {
  ListSource,
  nodesKey,
  NodesProducerReference,
  ListItemGetterReference,
  ListItemSetterReference
} from '@/lazyDB/database/types'
import { Producerable } from '@/lazyDB/core/types'

const HIDEN_PROPERTIES = [
  NodesProducerReference,
  ListItemGetterReference,
  ListItemSetterReference
]

export const makeListSource = (): ListSource => {
  const base: ListSource = {
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
    [ListItemSetterReference]: null,

    get maxPageNumber() {
      if (!this.onPage || !this.totalCount)
        return null

      return this.totalCount / this.onPage
    }
  }

  HIDEN_PROPERTIES.forEach(prop =>
    Object.defineProperty(base, prop, {
      // disallow enumerate
      enumerable: false,
      // default valus need write directly, for prevent rewrite
      writable: true,
      configurable: true
    }))

  return base
}

export function isListSource(data: Producerable): data is ListSource {
  if (!data[nodesKey] || !data[NodesProducerReference])
    return false

  return true
}

export interface ListSourceData {
    nodes: Array<Producerable>
    totalCount: number | null
}

export const isListSourceData = (source: any): source is ListSourceData => {
  if (typeof source !== 'object')
    return false

  if (!source.nodes || !Array.isArray(source.nodes))
    return false

  return true
}
