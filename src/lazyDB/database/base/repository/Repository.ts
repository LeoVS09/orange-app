import { getStore } from '@/lazyDB/core/common'
import { Producerable, EventProducer, IProducerStore } from '@/lazyDB/core/types'
import { receiveWithMemoryAndReducers } from '@/lazyDB/core/receiver'
import { repositoryReducers } from '@/lazyDB/database/connected/actions'
import { DatabaseDispatcher, switchStoreToDatabaseStore } from '@/lazyDB/database/dispatcher'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectSchema'
import { spawnRead } from '@/lazyDB/lifeCycle/spawnRead'
import { setupEventBubbling } from '@/lazyDB/core/bubbling'
import { whenChanged, updateOnChangeHandler, WhenChangedOptions } from '../../cycle/change'
import { applyRepositoryControls, ApplyRepositoryControlsOptions } from './controls'
import {
  DatabaseTable,
  IDatabaseModelProducerStore,
  ListProducer,
  OnChangeCallback
} from '../../types'
import { makeDatabaseTable, TableListKey } from '../../storage/table'
import { ModelEventTypes } from '../../events'
import { genGetFieldType } from '../getFieldType'
import { getListPropertyType } from './list'

export interface LazyReactiveRepositoryOptions {
   table?: DatabaseTable
   schema?: Partial<AosEntitySchema>
   applyRepositoryControlsOptions?: Partial<ApplyRepositoryControlsOptions>
}

const defaultPrimaryKey = 'id'
export default class LazyReactiveRepository<T extends Producerable<any> = Producerable> {
   public entity: string

   public table: DatabaseTable<T>

   public schema: AosEntitySchema

   public excludeProperties: Array<string | RegExp> = []

  public applyRepositoryControlsOptions: ApplyRepositoryControlsOptions

  constructor(
    entity: string,
    {
      table = makeDatabaseTable(),
      schema = {},
      applyRepositoryControlsOptions = {}
    }: LazyReactiveRepositoryOptions = {}
  ) {
    this.entity = entity
    this.table = table

    this.schema = {
      primaryKey: schema.primaryKey || defaultPrimaryKey,
      foreignKeys: schema.foreignKeys || [],
      fields: schema.fields || {}
    }

    this.applyRepositoryControlsOptions = {
      getFieldType: genGetFieldType(this.schema.fields),
      ...applyRepositoryControlsOptions
    }

    const tableStore = getStore(this.table)

    // this hack allow change schema after constructor execution
    tableStore!.extendTemporalTrap = trapStore =>
      applyRepositoryControls(trapStore, this.applyRepositoryControlsOptions)
  }

  public get store(): IDatabaseModelProducerStore<any, any> {
    return getStore(this.table) as IDatabaseModelProducerStore
  }

  public get dispatcher(): DatabaseDispatcher {
    return this.store.dispatcher as unknown as DatabaseDispatcher
  }

  // TODO: Add typesafe table
  public findOne(id: string, onChange?: OnChangeCallback): T {
    const { schema } = this
    if (!schema)
      return this.table[id] as T

    const model = this.table[id]
    const store = switchStoreToDatabaseStore(model)

    applyRepositoryControls(store, this.applyRepositoryControlsOptions)

    // Order of calls is important
    setupEventBubbling(store, this.store, id)
    appendRepositoryLifeHooks(store, this.excludeProperties)

    if (onChange)
      callOnChange(model, onChange)

    return model as T
  }

  public list(onChange?: OnChangeCallback): ListProducer<T> {
    const list = this.table[TableListKey] as unknown as ListProducer<T>

    const store = switchStoreToDatabaseStore(list)

    store.dispatcher.getPropertyType = getListPropertyType
    // Order of calls is important
    setupEventBubbling(store, this.store, TableListKey)
    appendRepositoryLifeHooks(store, this.excludeProperties)

    if (onChange)
      callOnChange(list, onChange)

    return list
  }

  public set(id: string, data: T | EventProducer<T>) {
    this.table[id] = data
  }
}

function appendRepositoryLifeHooks(
  store: IDatabaseModelProducerStore<any, any>,
  excludeProperties: Array<string | RegExp>
) {
  store.excludeProperties = excludeProperties

  // TODO: remove requiring of order
  // Current logic require this order to call functions
  receiveWithMemoryAndReducers(store, repositoryReducers as any)
  // spawn require to stream which generate only on async receive
  const { stream, dispatcher } = store
  stream!
    .pipe(spawnRead(store))
    .subscribe(payload => dispatcher.dispatch(ModelEventTypes.Read, payload))
}

export const getEntityPrimaryKey = (
  { primaryKey }: AosEntitySchema,
  entity: Producerable
): string | undefined =>
  entity[primaryKey]

// TODO: remove from repository and database
// use inside components directly
// or setup reactive property tracking
const callOnChange = <T extends Producerable<any> = Producerable>(model: T | ListProducer<T>, handler: OnChangeCallback, options?: WhenChangedOptions) => {
  const store = getStore<T, IDatabaseModelProducerStore<T, any>>(model as any)
  if (!store)
    throw new Error('Cannot call on change for not event producer')

  // spawn require to stream which generate only on async receive
  const { stream } = store

  stream!
    .pipe(whenChanged(options))
    .subscribe(updateOnChangeHandler(store, handler))
}
