import {AbstractData, ChangeCallback, ILazyReactiveDatabase, IModelObserver} from "./types";

class LazyReactiveDatabase implements ILazyReactiveDatabase {

   tables: {[key: string]: {[id: string]: IModelObserver}} = {}

   findOne(entity: string, id: string, wrapped = true): AbstractData | IModelObserver | undefined {
      if(!this.tables[entity])
         this.tables[entity] = {}

      const observer = this.tables[entity][id]
      if(!observer)
         return

      if(wrapped)
         return observer.wrapped

      return observer
   }

   set(entity: string, id: string, observer: IModelObserver) {
      if(!this.tables[entity])
         this.tables[entity] = {}

      this.tables[entity][id] = observer
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

export default Database
