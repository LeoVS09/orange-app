import { AosSchema } from '@/abstractObjectScheme'
import { schemaToQueryFields } from '.'
import { generateQueryEntityById, generateQueryList } from '@/lazyDB/connectors/queryMapper'
import { databaseClient } from '@/api/database/utils'
import { dateToStringFormatter } from '@/lazyDB/utils'

export const api = {
  async fetch(entity: string, id: string, schema: AosSchema) {
    // TODO: schema not generated for internal nodes objects
    console.log('read schema', schema)

    const fields = schemaToQueryFields(schema)
    console.log('read schema fields', fields)

    const { query, name } = generateQueryEntityById(entity, fields)
    console.log('read schema query', query)

    const { data, errors } = await databaseClient.query({
      query,
      variables: { id },
    })

    if (errors) {
      console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
      throw new Error(`Error on request${errors.toString()}`)
    }

    console.log('data result fetched', data)

    const formated = dateToStringFormatter(data)

    return formated[name]
  },

  async list(entity: string, schema: AosSchema) {
    // TODO: schema not generated for internal nodes objects
    console.log('read schema for list', schema)

    const fields = schemaToQueryFields(schema)
    console.log('read schema fields', fields)

    const { query, name } = generateQueryList(entity, fields)
    console.log('read schema query', query)

    const { data, errors } = await databaseClient.query({
      query,
    })

    if (errors) {
      console.error('Errors on read request to entity', entity, 'with returned data:', data, 'and errors', errors)
      throw new Error(`Error on request${errors.toString()}`)
    }

    console.log('data result fetched', data)

    const formated = dateToStringFormatter(data)

    return formated[name]
  },
}
