import { APIClient } from '@/api/database/client'
import { AosSchema, isRelationsAosField } from '@/abstractObjectSchema'
import { OperationVariables } from 'apollo-client'
import { dateToStringFormatter } from '../../utils'
import { generateQueryFromAosSchema, QueryVariable, QueryVariables } from '../graphql'
import { TableListKey } from '../../database/storage/table'

/** Generate list quiery name based on enitty name */
function entityToList(entity: string): string {
  if (entity.slice(-1) === 'y')
    return `${entity.slice(0, -1)}ies`

  return `${entity}s`
}

// variables whicch require for generate correct query
//  for single entity by id
export const queryByIdVariables = (value: string): QueryVariables => ({ id: { type: 'UUID', value, required: true } })

export class PostgraphileAdapter {
  constructor(
    private client: APIClient
  ) {}

  get sendQuery() {
    return sendQuery(this.client)
  }

  async entityById<T>(entity: string, id: string, schema: AosSchema): Promise<T> {
    return this.sendQuery(
      entity,
      schema,
      queryByIdVariables(id)
    )
  }

  async entityList<T>(entity: string, schema: AosSchema): Promise<T> {
    return this.sendQuery(
      entityToList(entity),
      schema
    )
  }

}

const mapQueryVariablesToClient = (variables?: QueryVariables): OperationVariables | undefined => {
  if (!variables)
    return

  const result: OperationVariables = {}
  for (const key of Object.keys(variables)) {
    const value = variables[key]
    if (typeof value !== 'object') {
      result[key] = value
      continue
    }

    result[key] = value.value
  }

  return result
}

export const sendQuery = (client: APIClient) => async <T>(operation: string, schema: AosSchema, variables?: QueryVariables): Promise<T> => {
  const query = generateQueryFromAosSchema({
    operation,
    schema,
    variables
  })
  console.log('[PostgraphileAdapter] read schema query', { schema, query })

  const { data, errors } = await client.query<any>({
    query,
    variables: mapQueryVariablesToClient(variables)
  })

  if (errors) {
    console.error('Errors on read request to entity', operation, 'with returned data:', data, 'and errors', errors)
    throw new Error(`Error on request${errors.toString()}`)
  }

  console.log('[PostgraphileAdapter] data result fetched', data)

  const formated = dateToStringFormatter(data)

  return formated[operation]
}
