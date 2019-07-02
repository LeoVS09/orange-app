import {
   ModelEvent,
   ModelEventGetPropertyPayload,
   ModelEventReadPayload,
   ModelEventSetPropertyPayload,
   ModelEventType
} from "./events";
import {generateQueryEntityById, QueryField} from "./queryMapper";
import {client} from "@/api/database/utils";
import {dateToStringFormatter} from "./utils";
import {IModelObserver, ModelAttributeType, ModelSchema, ModelSchemaField} from "./types";
import {ModelObserver} from "@/lazyReactiveORM/ModelObserver";


function appendPropertyToSchema(schema: ModelSchema, {name, inner, type}: ModelEventGetPropertyPayload) {
   if(!inner)
      return schema[name] = type

   if(!schema[name])
      schema[name] = {
         type,
         fields: {}
      }

   let property = schema[name]
   if(isSchemaField(property))
      return property.fields[inner.name] = inner.type

   return schema[name] = {
      type: type,
      fields: {
         [inner.name]: inner.type
      }
   }
}

function isSchemaField(field: ModelSchemaField | ModelAttributeType): field is ModelSchemaField {
   return typeof field === 'object'
}

// TODO: multiple types of object schema, need better solution
function schemaToQueryFields(schema: ModelSchema): Array<string | QueryField> {
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

export const actions = {

   [ModelEventType.GetProperty](model: IModelObserver, payload: ModelEventGetPropertyPayload): any {
      appendPropertyToSchema(model.schema, payload)
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

      const query = generateQueryEntityById(model.entity, schemaToQueryFields(readProperties))
      const { data } = await client.query({
         query,
         variables: {id}
      })

      return data[model.entity]
   },

   [ModelEventType.ReadSuccess](model: IModelObserver, data: {[key: string]: any}) {
      model.data = dateToStringFormatter(data)
   },

}
