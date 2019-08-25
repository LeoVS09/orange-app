import {
   ILazyReactiveDatabase,
   IEntityTypeSchema,
   IEntityTypeSchemaStorage,
} from '../../types'
import {AbstractData, EventProducer, EventType, ModelAttributeType} from "@/lazyDB/core/types";
import {getStore} from "@/lazyDB/core/common";
import {DatabaseStorage} from "../../types";
import {makeDatabaseStorage} from "../../storage";
import {ModelEventDispatcher} from "@/lazyDB/core/dispatcher/model/base";
import {extractEntityNameFromManyKey} from "@/lazyDB/utils";
import {ProducerStore} from "@/lazyDB/core/producer/Store";
import {asyncReceiveWithMemory} from "@/lazyDB/core/receiver";

const DEFAULT_EXCLUDE_PROPERTIES = [
   'state',
   '_isVue',
   'render',
   'toJSON',
   'constructor',
   '__ob__',
   'then',
   'function () { [native code] }'
]

export default class LazyReactiveDatabase implements ILazyReactiveDatabase {

   public storage: DatabaseStorage = makeDatabaseStorage()

   // TODO: part of properties can be computed to exclude
   public excludeProperties = [...DEFAULT_EXCLUDE_PROPERTIES]

   public schemas: IEntityTypeSchemaStorage = {}

   constructor(){
      asyncReceiveWithMemory(this.store, {
         [EventType.GetProperty]: (...args) => {
            console.log('EventType.GetProperty', ...args)
            return false
         },
         [EventType.SetProperty]: (...args) => {
            console.log('EventType.SetProperty', ...args)
            return false
         },
         [EventType.DeleteProperty]: (...args) => {
            console.log('EventType.DeleteProperty', ...args)
            return false
         }
      })
   }

   public get store(): ProducerStore {
      return getStore(this.storage) as ProducerStore
   }

   public get dispatcher(): ModelEventDispatcher {
      const store = getStore(this.storage)
      return store.dispatcher as ModelEventDispatcher
   }

   public setSchema(entity: string, schema: IEntityTypeSchema) {
      this.schemas[entity] = schema
   }

   public findOne(entity: string, id: string): EventProducer {
      // if(!this.schemas[entity])
         return this.storage[entity][id]

      // const schema = this.schemas[entity]
      // const model = this.storage[entity][id]
      // const store = getStore(model)
      //
      // store.getter = ()
      //
      // return model
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

      for (const key in data)
         model[key] = data[key]

      return true
   }

   public getSchemaByKey(key: string, type: ModelAttributeType) {
      let fieldEntity = key
      if (type === ModelAttributeType.OneToMany)
         fieldEntity = extractEntityNameFromManyKey(key)

      return this.schemas[fieldEntity]
   }
}
