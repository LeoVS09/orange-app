import {
  IProducerStore,
  ProducerStoreGetter,
  ProducerStoreSetter,
  ModelPropertyKey
} from '@/lazyDB/core/types'
import { wrapInProducer } from '@/lazyDB/core/wrap'
import { getStore } from '@/lazyDB/core/common'
import { SymFor } from '@/lazyDB/core/utils'
import {
  DatabaseTable,
  DatabaseTableMap,
  ListItemGetter,
  ListItemGetterReference,
  ListItemSetterReference,
  ListItemSetter
} from '@/lazyDB/database/types'
import { applyListControls, makeListSource } from '@/lazyDB/database/base/repository/list'
import { AosFieldType } from '@/abstractObjectSchema'
import { isTemporalTrapProducer, isTemporalTrap } from '../base/repository/temporal'

export const TableStoreReference = SymFor('table storage')

// Used string, because event producer get symbols and strings starts from `_` from base as it is
export const TableListKey = '$__list__'

export const isListKey = (key: string): boolean => key === TableListKey

export const makeTableSource = (table: DatabaseTableMap) => ({
  [TableStoreReference]: table
})

export function makeDatabaseTable(table: DatabaseTableMap = new Map()): DatabaseTable {
  const source = makeTableSource(table)
  const producer = wrapInProducer(source)
  const store = getStore(producer)!

  applyTableControls(store)

  return producer
}

export function applyTableControls(store: IProducerStore) {
  store.getter = getter
  store.setter = setter
  store.dispatcher.getPropertyType = getTablePropertyType
}

export const getTablePropertyType = (name: ModelPropertyKey): AosFieldType => {
  if (isListKey(name as string))
    return AosFieldType.Service

  return AosFieldType.OneToOne
}

export const getter: ProducerStoreGetter = ({ base }, name) => {
  if (name === TableListKey)
    return base[TableListKey] || makeListSource()

  const table = base[TableStoreReference] as DatabaseTableMap
  const model = table.get(name as string)

  return model || {}
}

export const setter: ProducerStoreSetter = ({ base, extendTemporalTrap }, name, value) => {
  const table = base[TableStoreReference] as DatabaseTableMap

  if (name === TableListKey) {
    base[TableListKey] = value

    const store = getStore(value)
    if (!store)
      throw new Error('Trying to set not producer as list')

    store.extendTemporalTrap = extendTemporalTrap
    applyListControls(store)

    value[ListItemGetterReference] = listItemGetter(table)
    value[ListItemSetterReference] = listItemSetter(table)
  }

  table.set(name as string, value)
  return true
}

export const listItemGetter = (table: DatabaseTableMap): ListItemGetter => ({ nodes }, index) => {
  const id = nodes[index as number]
  if (!id) {
    console.warn('[Table] list item getter not foind id', nodes, index)
    return
  }

  if (isTemporalTrap(id)) {
    console.log('[Table] will return tamporal trap from list', nodes, index)
    return id
  }

  return table.get(id)
}

export interface IGetEntityId {
  (value: any): string | undefined
}

// TODO: must not be used .id property, create getEntityId generator
const defaultGetEntityId: IGetEntityId = (value: any): string | undefined => {
  if (typeof value !== 'object')
    return

  // @ts-ignore
  return value.id
}

export const listItemSetter = (table: DatabaseTableMap, getEntityId: IGetEntityId = defaultGetEntityId): ListItemSetter =>
  (_, __, value) => {
    const id = getEntityId(value)
    if (!id) {
      console.warn('[Table] setter, was not received id for value', value, 'will return null')
      return null
    }
    table.set(id, value)

    return id
  }
