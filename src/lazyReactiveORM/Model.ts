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
   }

   findOne(id: string, changed?: ChangeCallback) {
      const founded = this.db.findOne(this.entity, id)
      if(founded)
         return founded

      const observer = new ModelObserver(this.entity, {id, changed, predefinedSchema: this   .predefinedSchema})

      this.db.set(this.entity, id, observer)

      return observer.wrapped
   }
}
