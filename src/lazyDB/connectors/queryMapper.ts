import gql from 'graphql-tag'
import { ModelAttributeType } from '@/lazyDB/core/types'

export interface QueryField {
  entity: string
  type: ModelAttributeType
  fields: Array<string | QueryField>
}

const requiredFields = ['id', 'nodeId']

const makeSpaces = (count: number) => new Array(count).fill('\t').join('')

function buildFieldsQuery(fields: Array<string | QueryField>, countSpaces = 1): string {
  const generateField = (field: string | QueryField) => {
    if (typeof field !== 'object')
      return field

    if (field.type === ModelAttributeType.OneToOne)
      return `${field.entity} ${buildFieldsQuery(field.fields, countSpaces + 1)}`

    if (field.type === ModelAttributeType.OneToMany) {
      return `${field.entity} {\n`
        + `${makeSpaces(countSpaces + 1)}totalCount\n`
        + `${makeSpaces(countSpaces + 1)}nodes ${buildFieldsQuery(field.fields, countSpaces + 2)}\n`
        + `${makeSpaces(countSpaces)}}`
    }

    throw new Error(`Unexpected field type${field.type}`)
  }

  const uniquely = removeEqual([...requiredFields, ...fields])

  const values = uniquely.reduce((all, field) =>
    `${all}\n${
      makeSpaces(countSpaces)}${generateField(field)}`,
  '')

  return `{${values}\n${
    makeSpaces(countSpaces - 1)}}`
}

function removeEqual<T>(items: Array<T>): Array<T> {
  const result: Array<T> = []

  for (const item of items) {
    if (!result.some(v => v === item))
      result.push(item)
  }

  return result
}

export function generateQueryEntityById(entity: string, fields: Array<string | QueryField>): any {
  const queryName = firstToUpperCase(entity)

  const query = `
      query ${queryName}($id: UUID!) {
         ${entity}(id: $id) ${buildFieldsQuery(fields, 3)}
      }
   `

  console.log('query', query)
  return gql(query)
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
