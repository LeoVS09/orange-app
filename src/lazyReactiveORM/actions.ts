import {
   ModelEvent,
   ModelEventGetPropertyPayload,
   ModelEventReadPayload,
   ModelEventSetPropertyPayload,
   ModelEventType
} from "./events";
import {generateQueryEntityById, QueryField} from "./queryMapper";
import {client} from "@/api/database/utils";
import {
   addOrUpdate,
   dateToStringFormatter,
   extractEntityFromManyKey,
   isSchemaField,
   lastObjectPropertyName
} from "./utils";
import {ILazyReactiveDatabase, IModelObserver, ModelAttributeType, ModelSchema, ModelSchemaField} from "./types";
import {ModelObserver} from "@/lazyReactiveORM/ModelObserver";


export function appendPropertyToSchema(schema: ModelSchema, {name, inner, type}: ModelEventGetPropertyPayload): boolean {
   if(!inner) {
      if(schema[name])
         return false

      schema[name] = type
      return true
   }

   if(!schema[name])
      schema[name] = {
         type,
         fields: {}
      }

   let property = schema[name]
   if(isSchemaField(property)) {
      if(property.fields[inner.name])
         return false

      property.fields[inner.name] = inner.type
      return true
   }

   schema[name] = {
      type,
      fields: {
         [inner.name]: inner.type
      }
   }

   return true
}

// TODO: multiple types of object schema, need better solution
export function schemaToQueryFields(schema: ModelSchema): Array<string | QueryField> {
   const keys = Object.keys(schema)

   return keys.map(key => {
      const field = schema[key]
      if(!isSchemaField(field))
         return key

      return {
         entity: key,
         type: field.type,
         fields: schemaToQueryFields(field.fields as ModelSchema)
      }
   })
}

export interface IActionsInterface {
   [key: string ]: (model: ModelObserver, payload: any, events?: Array<ModelEvent<any>>) => any
}

const ONE_TO_MANY_KEY = 'nodes'

export const actions = {

   [ModelEventType.GetProperty](model: IModelObserver, payload: ModelEventGetPropertyPayload): boolean {
      const name = lastObjectPropertyName(payload)
      if(model.excludeProperties.some(value => value === name))
         return false

      return appendPropertyToSchema(model.schema, payload)
   },

   [ModelEventType.SetProperty](model: IModelObserver, {name, newValue}: ModelEventSetPropertyPayload) {
      model.data[name] = newValue
   },

   // TODO: this solution not allow read data which already has in object. Rewrite
   async [ModelEventType.Read](model: IModelObserver, {id, gets}: ModelEventReadPayload){
      const readProperties = {}
      // Schema have information, but gets events not have
      // Data is duplicated
      gets.forEach(event => appendPropertyToSchema(readProperties, event.payload))
      console.log('gets', gets, 'readProperties', readProperties)
      const query = generateQueryEntityById(model.entity, schemaToQueryFields(readProperties))
      const { data } = await client.query({
         query,
         variables: {id}
      })

      return data[model.entity]
   },

   [ModelEventType.ReadSuccess](model: IModelObserver, data: {[key: string]: any}) {
      const formated = dateToStringFormatter(data)
      model.data = {
         ...model.data,
         ...formated
      }

      Object.keys(formated).forEach(key => {
         const value = formated[key]

         let type = model.schema[key]
         if(typeof type === 'object')
            type = type.type

         if(type === ModelAttributeType.OneToMany) {
            console.log('Try add nodes to db')
            const nodes = value[ONE_TO_MANY_KEY] as Array<{id: string}>
            const {db} = model
            if(!db) {
               console.warn('Not have database in model observer to add more entities')
               return
            }

            const entity = extractEntityFromManyKey(key)

            addOrUpdate(db, entity, nodes)
            console.log('result of db', db)
         }

      })
   },

}

