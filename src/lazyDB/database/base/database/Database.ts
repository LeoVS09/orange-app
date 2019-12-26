import {
  ILazyReactiveDatabase,
  IDatabaseModelProducerStore,
  DatabaseStorage,
} from '../../types'
import {
  AbstractData,
  EventProducer,
} from '@/lazyDB/core/types'
import { getStore } from '@/lazyDB/core/common'

import { makeDatabaseStorage } from '../../storage'
import { ModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/base'
import { AosFieldType, AosEntitySchemaStorage, AosEntitySchema } from '@/abstractObjectScheme'
import { applyDatabaseControls, getSchemaByKey } from './controls'

export interface LazyReactiveDatabaseOptions {
  storage?: DatabaseStorage
  schemas?: AosEntitySchemaStorage
  excludeProperties?: Array<string>
}

export default class LazyReactiveDatabase implements ILazyReactiveDatabase {
  public storage: DatabaseStorage

  public schemas: AosEntitySchemaStorage

  public excludeProperties: Array<string>

  constructor(
    {
      storage = makeDatabaseStorage(),
      schemas = {},
      excludeProperties = [],
    }: LazyReactiveDatabaseOptions = {},
  ) {
    this.storage = storage
    this.schemas = schemas
    this.excludeProperties = excludeProperties
  }

  public get store(): IDatabaseModelProducerStore {
    return getStore(this.storage) as IDatabaseModelProducerStore
  }

  public get dispatcher(): ModelEventDispatcher {
    const store = getStore(this.storage)
    return store.dispatcher as ModelEventDispatcher
  }

  public setSchema(entity: string, schema: AosEntitySchema) {
    this.schemas[entity] = schema
    console.log('database schema was set', entity, schema, this.schemas)
  }

  public findOne(entity: string, id: string): EventProducer {
    if (!this.schemas[entity])
      return this.storage[entity][id]

    const model = this.storage[entity][id]
    const store = getStore(model)
    const schema = this.schemas[entity]

    const getSchema = (key: string) => getSchemaByKey(this.schemas, key, AosFieldType.OneToOne)
    applyDatabaseControls(store, schema, getSchema)

    return model
  }

  public set(entity: string, id: string, data: AbstractData | EventProducer) {
    this.storage[entity][id] = data
  }

  public add(entity: string, id: string, data: AbstractData): boolean {
    // TODO: produce event
    const model = this.storage[entity][id]
    if (model)
      return false

    this.set(entity, id, data)
    return true
  }

  public update(entity: string, id: string, data: AbstractData): boolean {
    // TODO: produce event
    const model = this.storage[entity][id]
    if (!model)
      return false

    Object.keys(data)
      .forEach(key => model[key] = data[key])

    return true
  }

  public getSchemaByKey(key: string, type: AosFieldType) {
    return getSchemaByKey(this.schemas, key, type)
  }

}
