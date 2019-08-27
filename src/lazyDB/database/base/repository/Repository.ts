import {makeDatabaseTable, TableListKey} from '../../storage/table'
import {ModelEventDispatcher} from '@/lazyDB/core/dispatcher/model/base'
import {getStore} from '@/lazyDB/core/common'
import {AbstractData, EventProducer, ModelAttributeType} from '@/lazyDB/core/types'
import {DatabaseTable, IDatabaseProducerStore, IEntityTypeSchema, ListProducer} from '../../types'
import {applyRepositoryControls} from './controls'
import {asyncReceiveWithMemory} from "@/lazyDB/core/receiver";
import {repositoryReducers} from "@/lazyDB/database/connected/actions";
import {getsSpawnReadEvent} from "@/lazyDB/database/cycle/read";

export interface LazyReactiveRepositoryOptions {
   table?: DatabaseTable
   schema?: IEntityTypeSchema
}

export default class LazyReactiveRepository {

   public entity: string
   public table: DatabaseTable
   public schema?: IEntityTypeSchema
   public excludeProperties: Array<string> = []

   constructor(
      entity: string,
      {
         table = makeDatabaseTable(),
         schema,
      }: LazyReactiveRepositoryOptions = {},
   ) {
      this.entity = entity
      this.table = table
      this.schema = schema
   }

   public get store(): IDatabaseProducerStore {
      return getStore(this.table) as IDatabaseProducerStore
   }

   public get dispatcher(): ModelEventDispatcher {
      return this.store.dispatcher as ModelEventDispatcher
   }

   public findOne(id: string, onChange?: () => void): EventProducer {
      if (!this.schema) {
         return this.table[id]
      }

      const model = this.table[id]
      const store = getStore(model) as IDatabaseProducerStore

      applyRepositoryControls(store, this.schema)

      store.excludeProperties = this.excludeProperties
      // TODO: remove requiring of order
      // Current logic require this order to call functions
      asyncReceiveWithMemory(store, repositoryReducers, id, ModelAttributeType.OneToOne)
      // spawn require to stream which generate only on async receive
      getsSpawnReadEvent(store)

      return model
   }

   public list<T = any>(): ListProducer<T> {
      return this.table[TableListKey] as ListProducer<T>
   }

   public set(id: string, data: AbstractData | EventProducer) {
      this.table[id] = data
   }

}

