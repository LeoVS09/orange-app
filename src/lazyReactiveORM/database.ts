import {AbstractData, ChangeCallback, ILazyReactiveDatabase, IModelObserver, IPredefinedSchema} from "./types";
import {ModelObserver} from "@/lazyReactiveORM/ModelObserver";

class LazyReactiveDatabase implements ILazyReactiveDatabase {

   tables: {[entity: string]: {[id: string]: IModelObserver}} = {}
   // TODO: part of properties can be computed to exclude
   excludeProperties = ['state', '_isVue', 'render', 'toJSON', 'constructor']

   schemas: {[entity: string]: IPredefinedSchema} = {}

   addPredefinedSchema(entity: string, schema: IPredefinedSchema){
      this.schemas[entity] = schema
   }

   findOne(entity: string, id: string, wrapped = true): IModelObserver | undefined {
      if(!this.tables[entity])
         this.tables[entity] = {}

      const observer = this.tables[entity][id]
      if(!observer)
         return

      return observer
   }

   set(entity: string, id: string, observer: IModelObserver) {
      if(!this.tables[entity])
         this.tables[entity] = {}

      this.tables[entity][id] = observer
   }

   add(entity: string, id: string, data: AbstractData) {
      const observer = new ModelObserver(entity, {
         id,
         db: this,
         data,
         excludeProperties: this.excludeProperties,
         predefinedSchema: this.schemas[entity] || {}
      })
      this.set(entity, id, observer)
   }

   update(entity: string, id: string, data: AbstractData): boolean {
      const have = this.findOne(entity, id, false) as IModelObserver
      if(!have)
         return false

      have.updateData(data)
      return true
   }

}

const Database = new LazyReactiveDatabase()
console.log('lazy database', Database)

export default Database
