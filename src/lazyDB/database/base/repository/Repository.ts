import {makeDatabaseTable, TableListKey} from '../../storage/table'
import {ModelEventDispatcher} from '@/lazyDB/core/dispatcher/model/base'
import {getStore, isProducer} from '@/lazyDB/core/common'
import {AbstractData, EventProducer} from '@/lazyDB/core/types'
import {DatabaseTable, IDatabaseProducerStore, IEntityTypeSchema, ListProducer} from '../../types'
import {applyRepositoryControls, getter, setter} from './controls'
import {ProducerStore} from '@/lazyDB/core/producer/Store'

export interface LazyReactiveRepositoryOptions {
   table?: DatabaseTable
   schema?: IEntityTypeSchema
}

export default class LazyReactiveRepository {

   public entity: string
   public table: DatabaseTable
   public schema?: IEntityTypeSchema

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
      const store = getStore(model)

      applyRepositoryControls(store, this.schema)

      return model
   }

   public list<T = any>(): ListProducer<T> {
      return this.table[TableListKey] as ListProducer<T>
   }

   public set(id: string, data: AbstractData | EventProducer) {
      this.table[id] = data
   }

}

