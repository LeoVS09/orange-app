import {
  Producerable,
  EventProducer,
  IProducerStore
} from '@/lazyDB/core/types'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { ModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/base'
import { AosFieldType, AosEntitySchemaStorage, AosEntitySchema } from '@/abstractObjectSchema'
import { getEntityPrimaryKey } from '@/lazyDB/database/base/repository/Repository'
import { isListSourceData } from '@/lazyDB/database/base/repository/list'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'
import { setupEventBubbling } from '@/lazyDB/core/bubbling'
import {
  applyDatabaseControls,
  getSchemaByKey,
  ISetEntity
} from './controls'
import { makeDatabaseStorage } from '../../storage'
import {
  ILazyReactiveDatabase,
  IDatabaseModelProducerStore,
  DatabaseStorage,
  ListItemGetterReference,
  ListItemGetter,
  DatabaseTable,
  NodesProducerReference
} from '../../types'

export interface LazyReactiveDatabaseOptions {
  storage?: DatabaseStorage
  schemas?: AosEntitySchemaStorage
  excludeProperties?: Array<string | RegExp>
}

export default class LazyReactiveDatabase implements ILazyReactiveDatabase {
  public storage: DatabaseStorage

  public schemas: AosEntitySchemaStorage

  public excludeProperties: Array<string | RegExp>

  constructor({
    storage = makeDatabaseStorage(),
    schemas = {},
    excludeProperties = []
  }: LazyReactiveDatabaseOptions = {}) {
    this.storage = storage
    this.schemas = schemas
    this.excludeProperties = excludeProperties
  }

  public get store(): IDatabaseModelProducerStore {
    return getStore(this.storage) as IDatabaseModelProducerStore
  }

  public get dispatcher(): ModelEventDispatcher {
    const store = getStore(this.storage)
    return store!.dispatcher as ModelEventDispatcher
  }

  public setSchema(entity: string, schema: AosEntitySchema) {
    this.schemas[entity] = schema
    console.log('database schema was set', entity, schema, this.schemas)
  }

  public findOne<T extends Producerable = Producerable>(entity: string, id: string): EventProducer<T> {
    // Probably error, we must apply controls in any case
    if (!this.schemas[entity])
      return this.storage[entity][id]

    const model = this.storage[entity][id]
    const store = getStore(model)
    const schema = this.schemas[entity]

    applyDatabaseControls(store!, schema, this.getSchemaByKey, this.setEntity)

    return model
  }

  /**
   * Hook which wil be called,
   * when someone try set entity to event producer,
   * allow store real object in storage
   * */
  public setEntity: ISetEntity = ({ base }, entity, type, data) => {
    console.log('[Database] Try set entity', base, entity, type, data)
    const entitySchema = this.getSchemaByKey(entity, type)

    if (type === AosFieldType.OneToMany) {
      if (!isListSourceData(data))
        throw new Error('Try set not list source to OneToMany field')

      const list = base[entity]
      const store = getStore(list)
      if (!store)
        throw new Error('List source wasn\'t wrapped as producer or not exists')

      const { base: listSource } = store
      const entityName = extractEntityNameFromManyKey(entity)

      // Clear array of nodes before start
      listSource.nodes.splice(0, listSource.nodes.length)

      for (let i = 0; i < data.nodes.length; i++) {
        const node = data.nodes[i]
        const id = getEntityPrimaryKey(entitySchema, node)
        if (typeof id !== 'string') {
          console.error('Not have primary key id in data', node, 'entity', entity, 'schema', entitySchema)
          throw new Error('Not have primary key id in data')
        }

        this.storage[entityName][id] = node
        listSource.nodes[i] = id
      }

      listSource.totalCount = data.totalCount

      // List may not have getter which must return data by id
      if (!listSource[ListItemGetterReference]) {
        const listItemGetter: ListItemGetter = (source, index) => {
          const { nodes } = source
          const id = nodes[index]
          if (!id) {
            console.log('[Database] WARN: list item getter not foind id', nodes, index)
            return
          }
          const node = this.storage[entityName][id]
          console.log('[Database] list item getter', nodes, index, node)

          if (!isProducer(node)) {
            console.error('[Database] list item is not producer', nodes, index, node)
            throw new Error('[Database] list item getter received not node without producer')
          }

          const nodeStore = getStore(node)
          const nodesStore = getStore(store.base[NodesProducerReference])!
          setupEventBubbling(nodeStore!, nodesStore, index)
          console.log('[Database] list nodesStore', node, nodesStore, 'nodes')
          return node
        }
        listSource[ListItemGetterReference] = listItemGetter
      }

      console.log('[Database] listSource.nodes', listSource.nodes)

      return list
    }

    if (type !== AosFieldType.OneToOne)
      console.warn('Unexpected data type for', entity, 'type', type, 'data', data, 'will work as OneToOne')

    const id = getEntityPrimaryKey(entitySchema, data)

    if (typeof id !== 'string') {
      console.error('Not have primary key id in data', data, 'entity', entity, 'schema', entitySchema)
      throw new Error('Not have primary key id in data')
    }

    this.storage[entity][id] = data

    return this.storage[entity][id]
  }

  public set<T extends Producerable = Producerable>(entity: string, id: string, data: T | EventProducer<T>) {
    this.storage[entity][id] = data
  }

  public add<T extends Producerable = Producerable>(entity: string, id: string, data: T | EventProducer<T>): boolean {
    // TODO: produce event
    const model = this.storage[entity][id]
    if (model)
      return false

    this.set(entity, id, data)
    return true
  }

  public update<T extends Producerable = Producerable>(entity: string, id: string, data: T | EventProducer<T>): boolean {
    // TODO: produce event
    const model = this.storage[entity][id]
    if (!model)
      return false

    Object.keys(data)
      .forEach(key => model[key] = data[key])

    return true
  }

  public getSchemaByKey = (entity: string, type: AosFieldType) => getSchemaByKey(this.schemas, entity, type)

}

