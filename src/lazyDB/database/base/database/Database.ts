import {
  Producerable,
  EventProducer
} from '@/lazyDB/core/types'
import { getStore } from '@/lazyDB/core/common'
import { ModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/base'
import { AosFieldType, AosEntitySchemaStorage, AosEntitySchema } from '@/abstractObjectSchema'
import { getEntityPrimaryKey } from '@/lazyDB/database/base/repository/Repository'
import { isListSourceData } from '@/lazyDB/database/base/repository/list'
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
  DatabaseTable
} from '../../types'
import { assignListSource } from './assignListSource'
import { saveEntity } from './saveEntity'

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
  public setEntity: ISetEntity = ({ base }, entity, type, value) => {
    console.log('[Database] Try set entity', base, entity, type, value)

    if (type === AosFieldType.Service) {
      if (isListSourceData(value)) {
        // in case when we receive list source, then linking in schema was declarated as OneToMany
        const entitySchema = this.getSchemaByKey(entity, AosFieldType.OneToMany)

        const existedList = base[entity] // TODO: possible need generate list source if assign was before get

        assignListSource(existedList, value, { entity, entitySchema, storage: this.storage })
        return existedList
      }

      throw new Error('Try set not list source to Service field')
    }

    if (type !== AosFieldType.OneToOne)
      console.warn('Unexpected data type for', entity, 'type', type, 'value', value, 'will work as OneToOne')

    const entitySchema = this.getSchemaByKey(entity, type)
    return saveEntity(value, entitySchema, this.storage[entity])
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

