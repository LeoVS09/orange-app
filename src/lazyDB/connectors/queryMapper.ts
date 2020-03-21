import gql from 'graphql-tag'
import { AosFieldType } from '@/abstractObjectScheme'

export interface QueryField {
  entity: string
  type: AosFieldType
  fields: Array<string | QueryField>
}

const requiredFields = ['id', 'nodeId']

const makeSpaces = (count: number) => new Array(count).fill('\t').join('')

const generateOneToOneQueryFields = (field: QueryField, countSpaces: number) =>
  `${field.entity} ${buildFieldsQuery(field.fields, countSpaces + 1)}`

const generateOneToManyQueryFields = (field: QueryField, countSpaces: number) =>
  `${field.entity} {\n`
    + `${makeSpaces(countSpaces + 1)}totalCount\n`
    + `${makeSpaces(countSpaces + 1)}nodes ${buildFieldsQuery(field.fields, countSpaces + 2)}\n`
    + `${makeSpaces(countSpaces)}}`

const generateField = (field: string | QueryField, countSpaces: number) => {
  if (typeof field !== 'object')
    return field

  if (field.type === AosFieldType.OneToOne)
    return generateOneToOneQueryFields(field, countSpaces)

  if (field.type === AosFieldType.OneToMany)
    return generateOneToManyQueryFields(field, countSpaces)

  throw new Error(`Unexpected field type${field.type}`)
}

function buildFieldsQuery(fields: Array<string | QueryField>, countSpaces = 1): string {
  const uniquely = removeEqual([...requiredFields, ...fields])

  const values = uniquely.reduce((all, field) =>
    `${all}\n${
      makeSpaces(countSpaces)}${generateField(field, countSpaces)
    }`,
  '')

  return `{${values}\n${
    makeSpaces(countSpaces - 1)
  }}`
}

function removeEqual<T>(items: Array<T>): Array<T> {
  const result: Array<T> = []

  for (const item of items) {
    if (!result.some((v) => v === item))
      result.push(item)
  }

  return result
}
export interface QueryEntityByIdGenerated {
  query: any,
  name: string
}

export function generateQueryEntityById(entity: string, fields: Array<string | QueryField>): QueryEntityByIdGenerated {
  const queryName = firstToUpperCase(entity)

  const query = `
      query ${queryName}($id: UUID!) {
         ${entity}(id: $id) ${buildFieldsQuery(fields, 3)}
      }
   `

  return { query: gql(query), name: entity }
}

export interface QueryListGenerated {
  query: any,
  name: string
}

export function generateQueryList(entity: string, fields: Array<string | QueryField>): QueryListGenerated {
  const listName = entityToList(entity)
  const queryName = firstToUpperCase(listName)

  const field = fields[0]

  if (typeof field !== 'object')
    throw new Error(`Cannot generate list for string field: ${entity}`)

  field.entity = listName

  const query = `
    query ${queryName} {
      ${generateOneToManyQueryFields(field, 1)}
    }
  `

  return { query: gql(query), name: listName }
}

function firstToUpperCase(str: string) {
  return str[0].toUpperCase() + str.slice(1)
}

function entityToList(entity: string): string {
  if (entity.slice(-1) === 'y')
    return `${entity.slice(0, -1)}ies`

  return `${entity}s`
}
