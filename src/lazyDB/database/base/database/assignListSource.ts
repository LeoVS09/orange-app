import { AosEntitySchema } from '@/abstractObjectSchema'
import { EventProducer } from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'
import { setupEventBubbling } from '@/lazyDB/core/bubbling'
import { getEntityPrimaryKey } from '../repository/Repository'
import { ListSourceData } from '../repository/list'
import {
  DatabaseStorage,
  ListSource,
  ListItemGetterReference,
  DatabaseTable,
  ListItemGetter,
  NodesProducerReference
} from '../../types'

export interface AssignListSourceOptions {
    entity: string
    entitySchema: AosEntitySchema
    storage: DatabaseStorage
  }

/** Assign items from source to target, by linking them into storage */
export function assignListSource(target: EventProducer<ListSource>, source: ListSourceData, { entity, entitySchema, storage }: AssignListSourceOptions) {
  const targetList = getRealListSource(target)
  const entityName = extractEntityNameFromManyKey(entity)

  // Clear array of nodes before start
  clear(targetList.nodes)

  // save nodes from source to storage table by id,
  // and save in target nodes array of id
  assignListSourceValues(targetList, source, storage[entityName], entitySchema)

  targetList.totalCount = source.totalCount

  // List may not have getter which must return data by id
  if (targetList[ListItemGetterReference])
    return

  targetList[ListItemGetterReference] = genListItemGetter(targetList, entityName, storage)
}

const getRealListSource = (target: EventProducer<ListSource>): ListSource => {
  const store = getStore(target)
  if (!store)
    throw new Error('List source wasn\'t wrapped as producer or not exists')

  return store.base
}

const clear = (nodes: Array<any>) => nodes.splice(0, nodes.length)

/**
 * For each item in source,
 * will extract id of entity,
 * save it in table, and link this item to target by id
 * */
const assignListSourceValues = (target: ListSource, source: ListSourceData, table: DatabaseTable, entitySchema: AosEntitySchema) => {
  for (let i = 0; i < source.nodes.length; i++) {
    const node = source.nodes[i]
    const id = getEntityPrimaryKey(entitySchema, node)
    if (typeof id !== 'string') {
      console.error('Not have primary key id in data', node, 'id', id, 'schema', entitySchema)
      throw new Error('Not have primary key id in data')
    }

    table[id] = node
    target.nodes[i] = id
  }
}

const genListItemGetter = (listSource: ListSource, entityName: string, storage: DatabaseStorage): ListItemGetter =>
  ({ nodes }, index) => {
    const id = nodes[index]
    if (!id) {
      console.warn('[Database] list item getter not foind id', nodes, index)
      return
    }
    const node = storage[entityName][id]
    console.log('[Database] list item getter', nodes, index, node)

    if (!isProducer(node)) {
      console.error('[Database] list item is not producer', nodes, index, node)
      throw new Error('[Database] list item getter received not node without producer')
    }

    const nodeStore = getStore(node)
    const nodesStore = getStore(listSource[NodesProducerReference]!)!
    setupEventBubbling(nodeStore!, nodesStore, index)
    console.log('[Database] list nodesStore', node, nodesStore, 'nodes')
    return node
  }
