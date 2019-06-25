import {AbstractData, ChangeCallback, ModelObserver} from "./ModelObserver";
import {wrapData} from "./wrapData";

class LazyReactiveORM {

   tables: {[key: string]: {[id: string]: AbstractData}} = {}

   find(entity: string, id: string, changed?: ChangeCallback): AbstractData {
      if(!this.tables[entity])
         this.tables[entity] = {}

      if(!this.tables[entity][id]) {
         const model = new ModelObserver(entity, id, changed)
         this.tables[entity][id] = wrapData(model)
      }
      return this.tables[entity][id]
   }

}

const DB = new LazyReactiveORM()

export default DB
