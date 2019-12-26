import { makeDatabaseTable, TableListKey } from '../../storage/table'
import { getStore } from '@/lazyDB/core/common'
import { AbstractData, EventProducer } from '@/lazyDB/core/types'
import {
  DatabaseTable,
  IDatabaseModelProducerStore,
  ListProducer,
  OnChangeCallback,
} from '../../types'
import {
  applyRepositoryControls, ApplyRepositoryControlsOptions,
} from './controls'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { repositoryReducers } from '@/lazyDB/database/connected/actions'
import { getsSpawnReadEvent } from '@/lazyDB/database/cycle/read'
import { DatabaseDispatcher, getDatabaseStore } from '@/lazyDB/database/dispatcher'
import { updateOnChange } from '../../cycle/change'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectScheme'

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

   public excludeProperties: Array<string> = []

  public applyRepositoryControlsOptions: ApplyRepositoryControlsOptions

  constructor(
    entity: string,
    {
      table = makeDatabaseTable(),
      schema = {},
      applyRepositoryControlsOptions = {},
    }: LazyReactiveRepositoryOptions = {},
  ) {
    this.entity = entity
    this.table = table
    this.applyRepositoryControlsOptions = applyRepositoryControlsOptions

    this.schema = {
      primaryKey: schema.primaryKey || defaultPrimaryKey,
      foreignKeys: schema.foreignKeys || [],
      fields: schema.fields || {},
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
  excludeProperties: Array<string>,
  onChange?: OnChangeCallback,
) {
  store.excludeProperties = excludeProperties
  // TODO: remove requiring of order
  // Current logic require this order to call functions
  asyncReceiveWithMemory(store, repositoryReducers, id, AosFieldType.OneToOne)
  // spawn require to stream which generate only on async receive
  getsSpawnReadEvent(store)

  updateOnChange(store, onChange)
}

const listOnChangeWrapper = (list: ListProducer<any>, onChange?: OnChangeCallback): OnChangeCallback => (event) => {

  // Hack for vue to track changed nodes
  // list.nodes.push(null)
  // list.nodes.pop()

  if (onChange)
    onChange(event)
}
