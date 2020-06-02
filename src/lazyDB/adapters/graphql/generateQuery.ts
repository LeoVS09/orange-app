import gql from 'graphql-tag'
import * as builder from 'gql-query-builder'
import { DocumentNode } from 'graphql'
import { QueryFields, QueryVariables } from './types'
import { PrettyQueryAdapter } from './prettyQueryAdapter'

export interface GenerateQueryOptions {
  /**
   * operation name
   * aka: "country" produce -> query Country { country { some, fields, ...}}
   * */
  operation: string,

  /** fields which will be inside query */
  fields: QueryFields

  /**
   * variables which will be set in query,
   * aka: "id" produce -> query ($id: String) { someQuery(id: $id) { ... }}
   * */
  variables?: QueryVariables
}

/**
 * Generate GraphQL query by given options
 */
export function generateQuery(options: GenerateQueryOptions): DocumentNode {
  try {
    const { query } = builder.query(options, PrettyQueryAdapter)

    console.debug('[GraphqlAdapter] generated query', options, query)
    return gql(query)

  } catch (e) {
    console.error('Cannot generate query', e)
    throw new Error(`Error on query generation\n${e.toString()}`)
  }
}
