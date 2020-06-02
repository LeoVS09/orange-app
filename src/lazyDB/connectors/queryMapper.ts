import gql from 'graphql-tag'
import { AosFieldType } from '@/abstractObjectSchema'

export interface QueryField {
  [entity: string]: QueryFields
}

const getQueryEntity = (field: QueryField): string => Object.keys(field)[0]

const getQueryFields = (field: QueryField): QueryFields => Object.values(field)[0]

const isQueryField = (field: string | QueryField): field is QueryField =>
  typeof field === 'object'

export type QueryFields = Array<string | QueryField>

const makeSpaces = (count: number) => new Array(count).fill('\t').join('')

const generateNestedQueryFields = (field: QueryField, countSpaces: number) =>
  `${getQueryEntity(field)} ${buildFieldsQuery(getQueryFields(field), countSpaces + 1)}`

const generateField = (field: string | QueryField, countSpaces: number) => {
  if (!isQueryField(field))
    return field

  return generateNestedQueryFields(field, countSpaces)
}

function buildFieldsQuery(fields: QueryFields, countSpaces = 1): string {
  const uniquely = removeEqual([...fields]).sort(sortFields)

  const values = uniquely.reduce(
    (all, field) =>
      `${all}\n${
        makeSpaces(countSpaces)}${generateField(field, countSpaces)
      }`,
    ''
  )

  return `{${values}\n${
    makeSpaces(countSpaces - 1)
  }}`
}

function removeEqual<T>(items: Array<T>): Array<T> {
  const result: Array<T> = []

  for (const item of items) {
    if (!result.some(v => v === item))
      result.push(item)
  }

  return result
}

const ID_KEY = 'id'
/**
 * Sort fields, for make queries more determenistic
 * Will pass id on top of query, and other fields in order on page
 * Id fields sorted, based on index of id inside word
 * result will looks like ['id', 'nodeId', 'otherId', ... other fields]
 * @param a - first field
 * @param b - second field
 */
const sortFields = (a: string | QueryField, b: string | QueryField): number => {

  // if each field not simple, then order not important
  if (typeof a !== 'string' && typeof b !== 'string')
    return 0

  // if only second field is simple, then second field will be upper
  if (typeof a !== 'string')
    return 1

  // if only first field is simple, then first field will be upper
  if (typeof b !== 'string')
    return -1

  const aId = a.toLowerCase().indexOf(ID_KEY)
  const bId = b.toLowerCase().indexOf(ID_KEY)

  // if they not have id, then order not important
  if (aId === -1 && bId === -1)
    return 0

  // if they all have id, then first 'id' in word will be upper in query
  if (aId !== -1 && bId !== -1)
    return aId - bId

  // if only first have id, then first word will be upper
  if (aId !== -1)
    return -1

  // if only second have id, then second word will be upper
  return 1
}
export interface QueryEntityByIdGenerated {
  query: any,
  name: string
}

export function generateQueryEntityById(entity: string, fields: QueryFields): QueryEntityByIdGenerated {
  try {
    const queryName = firstToUpperCase(entity)

    const query = `
      query ${queryName}($id: UUID!) {
         ${entity}(id: $id) ${buildFieldsQuery(fields, 3)}
      }
   `
    console.debug('[QueryMapper] generated query', query)
    return { query: gql(query), name: entity }

  } catch (e) {
    console.error('Cannot generate query', e)
    throw new Error(`Error on query generation\n${e.toString()}`)
  }
}

export interface QueryListGenerated {
  query: any,
  name: string
}

export function generateQueryList(entity: string, fields: QueryFields): QueryListGenerated {
  const listName = entityToList(entity)
  const queryName = firstToUpperCase(listName)

  const field = fields[0]

  if (!isQueryField(field))
    throw new Error(`Cannot generate list for string field: ${entity}`)

  const realField = { [listName]: getQueryFields(field) }

  const query = `
    query ${queryName} {
      ${generateNestedQueryFields(realField, 1)}
    }
  `
  console.debug('[QueryMapper] generated query', query)
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
