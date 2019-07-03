import db from './database'
import {ChangeCallback, IPredefinedSchema} from "./types";
import { ModelObserver} from "./ModelObserver";


export default class Model {
   entity: string
   predefinedSchema?: IPredefinedSchema
   db = db

   constructor(entity: string, predefinedSchema?: IPredefinedSchema) {
      this.entity = entity
      this.predefinedSchema = predefinedSchema

      if(this.predefinedSchema)
         this.db.addPredefinedSchema(this.entity, this.predefinedSchema)
   }

   findOne(id: string, changed?: ChangeCallback) {
      if(!id)
         return

      const founded = this.db.findOne(this.entity, id, false)
      if(founded) {
         founded.changed = changed
         return founded.wrapped
      }

      const observer = new ModelObserver(this.entity, {id, changed, predefinedSchema: this.predefinedSchema, db: this.db, excludeProperties: db.excludeProperties})

      this.db.set(this.entity, id, observer)

      return observer.wrapped
   }

   list(changed?: ChangeCallback){
      return {
         totalCount: null,

         nodes: []
      }
   }
}
