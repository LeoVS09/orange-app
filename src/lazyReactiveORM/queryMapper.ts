import gql from 'graphql-tag'

export interface QueryField {
   entity: string
   fields: Array<string | QueryField>
}

function buildFieldsQuery(fields: Array<string | QueryField>): string {
   return `{
      ${fields.reduce((all, field) => 
      `${all}
      ${typeof field !== 'object' ? 
         field :
         `${field.entity} ${buildFieldsQuery(field.fields)}`
      }`, 
      `nodeId
       id`
   )}
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

function firstToUpperCase(str: string) {
   return str[0].toUpperCase() + str.slice(1)
}
