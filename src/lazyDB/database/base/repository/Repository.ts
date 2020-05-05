import { getStore } from '@/lazyDB/core/common'
import { AbstractData, EventProducer } from '@/lazyDB/core/types'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { repositoryReducers } from '@/lazyDB/database/connected/actions'
import { DatabaseDispatcher, getDatabaseStore } from '@/lazyDB/database/dispatcher'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectSchema'
import { spawnRead } from '@/lazyDB/lifeCycle/spawnRead'
import { whenChanged, updateOnChangeHandler, listOnChangeWrapper } from '../../cycle/change'
import {
  applyRepositoryControls, ApplyRepositoryControlsOptions
} from './controls'
import {
  DatabaseTable,
  IDatabaseModelProducerStore,
  ListProducer,
  OnChangeCallback
} from '../../types'
import { makeDatabaseTable, TableListKey } from '../../storage/table'
import { ModelEventTypes } from '../../events'

export interface LazyReactiveRepositoryOptions {
   table?: DatabaseTable
   schema?: Partial<AosEntitySchema>
  applyRepositoryControlsOptions?: ApplyRepositoryControlsOptions
}

const defaultPrimaryKey = 'id'
export default class LazyReactiveRepository<T extends AbstractData = AbstractData> {
   public entity: string

   public table: DatabaseTable

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
    this.applyRepositoryControlsOptions = applyRepositoryControlsOptions

    this.schema = {
      primaryKey: schema.primaryKey || defaultPrimaryKey,
      foreignKeys: schema.foreignKeys || [],
      fields: schema.fields || {}
    }

    const tableStore = getStore(this.table)

    // this hack allow change schema after constructor execution
    tableStore.extendTemporalTrap = trapStore =>
      applyRepositoryControls(trapStore, this.schema, this.applyRepositoryControlsOptions)
  }

  public get store(): IDatabaseModelProducerStore {
    return getStore(this.table) as IDatabaseModelProducerStore
  }

  public get dispatcher(): DatabaseDispatcher {
    return this.store.dispatcher as DatabaseDispatcher
  }

  // TODO: Add typesafe table
  public findOne(id: string, onChange?: OnChangeCallback): T {
    if (!this.schema)
      return this.table[id] as T

    const model = this.table[id]
    const store = getDatabaseStore(model)

    applyRepositoryControls(store, this.schema, this.applyRepositoryControlsOptions)

    appendRepositoryLifeHooks(store, id, this.excludeProperties, onChange)

    return model as T
  }

  public list(onChange?: OnChangeCallback): ListProducer<T> {
    const list = this.table[TableListKey] as ListProducer<T>

    const store = getDatabaseStore(list)

    onChange = listOnChangeWrapper(list, onChange)

    appendRepositoryLifeHooks(store, TableListKey, this.excludeProperties, onChange)

    return list
  }

  public set(id: string, data: AbstractData | EventProducer) {
    this.table[id] = data
  }
}

function appendRepositoryLifeHooks(
  store: IDatabaseModelProducerStore,
  id: string,
  excludeProperties: Array<string | RegExp>,
  onChange?: OnChangeCallback
) {
  store.excludeProperties = excludeProperties
  // TODO: remove requiring of order
  // Current logic require this order to call functions
  asyncReceiveWithMemory(store, repositoryReducers, id, AosFieldType.OneToOne)
  // spawn require to stream which generate only on async receive
  const { stream, memory, dispatcher } = store
  stream!
    .pipe(spawnRead({ memory: memory! }))
    .subscribe(payload => dispatcher.dispatch(ModelEventTypes.Read, payload))

  stream!
    .pipe(whenChanged())
    .subscribe(updateOnChangeHandler(store, onChange))
}

export const getEntityPrimaryKey = (
  { primaryKey }: AosEntitySchema,
  entity: AbstractData
): string | undefined =>
  entity[primaryKey]
