import { AosSchema } from '@/abstractObjectSchema'
import { dateToStringFormatter } from '@/lazyDB/utils'
import { OperationVariables } from 'apollo-client'
import { ExecutionResult } from 'graphql'
import { QueryVariables, APIClient } from './types'
import { generateQueryFromAosSchema, generateMutationFromAosSchema } from './aos'

export * from './types'
export * from './schemaToQuery'
export * from './generateQuery'
export * from './generateMutation'

export const mapQueryVariablesToClient = (variables?: QueryVariables): OperationVariables | undefined => {
  if (!variables)
    return

  const result: OperationVariables = {}
  for (const key of Object.keys(variables)) {
    const value = variables[key]
    if (typeof value !== 'object') {
      result[key] = value
      continue
    }

    const nested = value.value
    if (typeof nested !== 'object') {
      result[key] = nested
      continue
    }

    result[key] = mapQueryVariablesToClient(nested)
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

  const result = await client.query<any>({
    query,
    variables: mapQueryVariablesToClient(variables)
  })

  return processQueryResult(result, operation)
}

export const sendMutation = (client: APIClient) => async <T>(operation: string, schema: AosSchema, variables?: QueryVariables): Promise<T> => {
  const mutation = generateMutationFromAosSchema({
    operation,
    schema,
    variables
  })
  console.log('[PostgraphileAdapter] mutate schema query', { schema, mutation })

  const result = await client.mutate<any>({
    mutation,
    variables: mapQueryVariablesToClient(variables)
  })

  return processQueryResult(result, operation)
}

export const processQueryResult = <T extends {[key: string]: any}>({ data, errors }: ExecutionResult<T>, operation: string) => {

  if (errors || !data) {
    console.error('Errors on request to', operation, 'with returned data:', data, 'and errors', errors)
    throw new Error(`Error on request${errors && errors.toString()}`)
  }

  console.log('[PostgraphileAdapter] data result fetched', data)

  const formated = dateToStringFormatter(data)

  return formated[operation]
}
