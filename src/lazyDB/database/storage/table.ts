import { IProducerStore, ProducerStoreGetter, ProducerStoreSetter } from '@/lazyDB/core/types'
import { wrapInProducer } from '@/lazyDB/core/producer/wrap'
import { getStore } from '@/lazyDB/core/common'
import { SymFor } from '@/lazyDB/core/utils'
import {
  DatabaseTable, DatabaseTableMap, ListItemGetter, ListItemGetterReference,
} from '@/lazyDB/database/types'
import { applyListControls, makeListSource } from '@/lazyDB/database/base/repository/list'

export const TableStoreReference = SymFor('table storage')

// Used string, because event producer get symbols from base as it is
export const TableListKey = '__list__'

export const makeTableSource = (table: DatabaseTableMap) => ({
  [TableStoreReference]: table,
})

export function makeDatabaseTable(table: DatabaseTableMap = new Map()): DatabaseTable {
  const source = makeTableSource(table)
  const producer = wrapInProducer(source)
  const store = getStore(producer)

  applyTableControls(store)

  return producer
}

export function applyTableControls(store: IProducerStore) {
  store.getter = getter
  store.setter = setter
}

export const getter: ProducerStoreGetter = ({ base }, name) => {
  if (name === TableListKey)
    return base[TableListKey] || makeListSource()

  const table = base[TableStoreReference] as DatabaseTableMap
  const model = table.get(name as string)

  return model || { }
}

export const setter: ProducerStoreSetter = ({ base }, name, value) => {
  const table = base[TableStoreReference] as DatabaseTableMap

  if (name === TableListKey) {
    base[TableListKey] = value

    const store = getStore(value)
    applyListControls(store)

    value[ListItemGetterReference] = listItemGetter(table)
  }

  table.set(name as string, value)
  return true
}

const listItemGetter = (table: DatabaseTableMap): ListItemGetter => ({ nodes }, index) => {
  const id = nodes[index as number]
  if (!id)
    return

  return table.get(id)
}
