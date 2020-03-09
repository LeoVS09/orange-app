import {
  ListSource,
  nodesKey,
  NodesProducerReference,
  ListItemGetterReference,
  ListItemSetterReference
} from '@/lazyDB/database/types'
import { AbstractData } from '@/lazyDB/core/types'

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
  [ListItemSetterReference]: null,

  get maxPageNumber() {
    if (!this.onPage || !this.totalCount)
      return null

    return this.totalCount / this.onPage
  }
})

export function isListSource(data: AbstractData): data is ListSource {
  if (!data[nodesKey] || !data[NodesProducerReference])
    return false

  return true
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
