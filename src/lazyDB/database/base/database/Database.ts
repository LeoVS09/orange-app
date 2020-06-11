import {
  Producerable,
  EventProducer
} from '@/lazyDB/core/types'
import { getStore } from '@/lazyDB/core/common'
import { ModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/base'
import { AosEntitySchemaStorage, AosEntitySchema } from '@/abstractObjectSchema'
import {
  applyDatabaseControls,
  IGetTable,
  genSetLinkedEntity
} from './controls'
import { makeDatabaseStorage } from '../../storage'
import {
  ILazyReactiveDatabase,
  IDatabaseModelProducerStore,
  DatabaseStorage
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

    applyDatabaseControls(store!, schema, this.genSetLinkedEntity(schema))

    return model
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

  // TODO: need receive field name and generate table name from it by getTableNameByField
  //  for getSchemaByKey and getTable

  private getSchema = (tableName: string) => this.schemas[tableName]

  private getTable: IGetTable = tableName => this.storage[tableName]

  public genSetLinkedEntity(schema: AosEntitySchema) {
    return genSetLinkedEntity(
      schema,
      this.getSchema,
      this.getTable
    )
  }
}

