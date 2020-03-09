import { AosSchema } from '@/abstractObjectScheme'
import { generateQueryEntityById, generateQueryList } from '@/lazyDB/connectors/queryMapper'
import { databaseClient } from '@/api/database/utils'
import { dateToStringFormatter } from '@/lazyDB/utils'
import { TableListKey } from '@/lazyDB/database/storage/table'
import { schemaToQueryFields } from './utils'

export const fetch = async (entity: string, id: string, schema: AosSchema) => {
  // TODO: schema not generated for internal nodes objects
  console.log('read schema', schema)

  const fields = schemaToQueryFields(schema)
  console.log('read schema fields', fields)

  const { query, name } = generateQueryEntityById(entity, fields)
  console.log('read schema query', query)

  const { data, errors } = await databaseClient.query({
    query,
    variables: { id }
  })

  if (errors) {
    console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
    throw new Error(`Error on request${errors.toString()}`)
  }

  console.log('data result fetched', data)

  const formated = dateToStringFormatter(data)

  return formated[name]
}

export const list = async (entity: string, schema: AosSchema) => {
  // TODO: schema not generated for internal nodes objects
  console.log('read schema for list', schema)

  const fields = schemaToQueryFields(schema)
  console.log('read schema fields', fields)

  const { query, name } = generateQueryList(entity, fields)
  console.log('read schema query', query)

  const { data, errors } = await databaseClient.query({
    query
  })

  if (errors) {
    console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
    throw new Error(`Error on request${errors.toString()}`)
  }

  console.log('data result fetched', data)

  const formated = dateToStringFormatter(data)

  return formated[name]
}

export const fetchListOrEntity = (payload: any) => {
  if (payload.inner.name === TableListKey)
    return list(payload.name, payload.inner.inner.readSchema)

  return fetch(payload.name, payload.inner.name, payload.inner.inner.readSchema)
}
