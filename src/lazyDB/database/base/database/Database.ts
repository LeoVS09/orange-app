import {
  ILazyReactiveDatabase,
  IEntityTypeSchema,
  IEntityTypeSchemaStorage,
  IDatabaseProducerStore,
  DatabaseStorage,
} from '../../types'
import {
  AbstractData,
  EventProducer,
  ModelAttributeType,
} from '@/lazyDB/core/types'
import { getStore } from '@/lazyDB/core/common'

import { makeDatabaseStorage } from '../../storage'
import { ModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/base'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'
import { applyRepositoryControls } from '@/lazyDB/database/base/repository/controls'

export interface LazyReactiveDatabaseOptions {
  storage?: DatabaseStorage
  schemas?: IEntityTypeSchemaStorage
  excludeProperties?: Array<string>
}

export default class LazyReactiveDatabase implements ILazyReactiveDatabase {
  public storage: DatabaseStorage

  public schemas: IEntityTypeSchemaStorage

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

  public get store(): IDatabaseProducerStore {
    return getStore(this.storage) as IDatabaseProducerStore
  }

  public get dispatcher(): ModelEventDispatcher {
    const store = getStore(this.storage)
    return store.dispatcher as ModelEventDispatcher
  }

  public setSchema(entity: string, schema: IEntityTypeSchema) {
    this.schemas[entity] = schema
    console.log('database schema setted', entity, schema, this.schemas)
  }

  public findOne(entity: string, id: string): EventProducer {
    if (!this.schemas[entity])
      return this.storage[entity][id]

    const model = this.storage[entity][id]
    const store = getStore(model)
    const schema = this.schemas[entity]

    applyRepositoryControls(store, schema)

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

  public getSchemaByKey(key: string, type: ModelAttributeType) {
    let fieldEntity = key
    if (type === ModelAttributeType.OneToMany)
      fieldEntity = extractEntityNameFromManyKey(key)

    return this.schemas[fieldEntity]
  }
}
