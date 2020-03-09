import { SymFor } from '@/lazyDB/core/utils'
import {
  ProducerStoreGetter,
  ProducerStoreSetter
} from '@/lazyDB/core/types'
import { DatabaseStorage, DatabaseStorageMap, DatabaseTableMap } from '@/lazyDB/database/types'
import { wrapInProducer } from '@/lazyDB/core/producer/wrap'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { applyTableControls, makeTableSource, TableStoreReference } from './table'

export const DatabaseStoreReference = SymFor('database storage')

export function makeDatabaseStorage(database: DatabaseStorageMap = new Map()): DatabaseStorage {
  const producer = wrapInProducer({
    [DatabaseStoreReference]: database
  })

  const store = getStore(producer)

  store.getter = getter
  store.setter = setter

  return producer
}

function getTableOrCreate(store: DatabaseStorageMap, entity: string): DatabaseTableMap {
  let table = store.get(entity)
  if (table)
    return table

  table = new Map()
  store.set(entity, table)

  return table
}

const getter: ProducerStoreGetter = ({ base }, name) => {
  if (base[name as string])
    return base[name as string]

  const database = base[DatabaseStoreReference]
  const table = getTableOrCreate(database, name as string)

  return makeTableSource(table)
}

const setter: ProducerStoreSetter = ({ base }, name, value) => {
  if (typeof value !== 'object')
    return false

  // TODO: refactor
  if (!(value instanceof Map)) {
    if (isProducer(value) && value[TableStoreReference]) {
      base[name as string] = value

      const store = getStore(value)

      applyTableControls(store)

      return true
    }

    return false
  }

  const database = base[DatabaseStoreReference] as DatabaseStorageMap
  database.set(name as string, value)

  // Force wrap table in next get
  base[name as string] = undefined

  return true
}
