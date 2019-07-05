import gql from 'graphql-tag'
import {ModelAttributeType} from "./types";

export interface QueryField {
   entity: string
   type: ModelAttributeType
   fields: Array<string | QueryField>
}

function buildFieldsQuery(fields: Array<string | QueryField>): string {

   const generateField = (field: string | QueryField) => {
      if(typeof field !== 'object')
         return field

      if(field.type === ModelAttributeType.OneToOne)
         return `${field.entity} ${buildFieldsQuery(field.fields)}`

      if(field.type === ModelAttributeType.OneToMany)
         return  `${field.entity} {
            totalCount
            nodes ${buildFieldsQuery(field.fields)}
         }`

      throw new Error('Unexpected field type' + field.type)
   }

   const values = fields.reduce((all, field) =>
      `${all}
      ${generateField(field)}`,
      `nodeId
       id`
   )
   return `{
      ${values}
      }`
}

export function generateQueryEntityById(entity: string, fields: Array<string | QueryField>): any {
   const queryName = firstToUpperCase(entity)

   return gql(`
      query ${queryName}($id: UUID!) {
         ${entity}(id: $id) ${buildFieldsQuery(fields)}
      }
   `)
}

export function generateQueryList(listName: string, fields: Array<string | QueryField>): any {
   const queryName = firstToUpperCase(listName)

   return gql(`
      query ${queryName} {
         ${listName} {
            totalCount
            nodes ${buildFieldsQuery(fields)}
         }
      }
   `)
}

function firstToUpperCase(str: string) {
   return str[0].toUpperCase() + str.slice(1)
}
