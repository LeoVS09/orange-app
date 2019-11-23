import { makeDatabaseTable, TableListKey } from '../../storage/table'
import { getStore } from '@/lazyDB/core/common'
import { AbstractData, EventProducer } from '@/lazyDB/core/types'
import {
  DatabaseTable,
  IDatabaseModelProducerStore,
  ListProducer,
  OnChangeCallback,
} from '../../types'
import { applyRepositoryControls, IGetSchema } from './controls'
import { asyncReceiveWithMemory } from '@/lazyDB/core/receiver'
import { repositoryReducers } from '@/lazyDB/database/connected/actions'
import { getsSpawnReadEvent } from '@/lazyDB/database/cycle/read'
import { DatabaseDispatcher, getDatabaseStore } from '@/lazyDB/database/dispatcher'
import { updateOnChange } from '../../cycle/change'
import { AosEntitySchema, AosFieldType } from '@/abstractObjectScheme'

export interface LazyReactiveRepositoryOptions {
   table?: DatabaseTable
   schema?: Partial<AosEntitySchema>
}

const defaultPrimaryKey = 'id'
export default class LazyReactiveRepository {
   public entity: string

   public table: DatabaseTable

   public schema?: AosEntitySchema

   public excludeProperties: Array<string> = []

   public getSchema?: IGetSchema

   constructor(
     entity: string,
     {
       table = makeDatabaseTable(),
       schema,
     }: LazyReactiveRepositoryOptions = {},
   ) {
     this.entity = entity
     this.table = table
     if (schema) {
       this.schema = {
         primaryKey: schema.primaryKey || defaultPrimaryKey,
         foreignKeys: schema.foreignKeys || [],
         fields: schema.fields || {},
       }
     }
   }

   public get store(): IDatabaseModelProducerStore {
     return getStore(this.table) as IDatabaseModelProducerStore
   }

   public get dispatcher(): DatabaseDispatcher {
     return this.store.dispatcher as DatabaseDispatcher
   }

   public findOne(id: string, onChange?: OnChangeCallback): EventProducer {
     if (!this.schema)
       return this.table[id]

     const model = this.table[id]
     const store = getDatabaseStore(model)

     applyRepositoryControls(store, this.schema, this.getSchema)

     appendRepositoryLifeHooks(store, id, this.excludeProperties, onChange)

     return model
   }

   public list<T = any>(onChange?: OnChangeCallback): ListProducer<T> {
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