import gql from 'graphql-tag'
import * as builder from 'gql-query-builder'
import { DocumentNode } from 'graphql'
import IMutationAdapter from 'gql-query-builder/build/adapters/IMutationAdapter'
import { QueryFields, QueryVariables } from './types'
import { PrettyMutationAdapter } from './prettyAdapters'

export interface GenerateMutationOptions {
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
 * Generate GraphQL mutation by given options
 */
export function generateMutation(options: GenerateMutationOptions): DocumentNode {
  try {
    const { query } = builder.mutation(options, PrettyMutationAdapter as unknown as IMutationAdapter)

    console.debug('[GraphqlAdapter] generated mutation', options, query)
    return gql(query)

  } catch (e) {
    console.error('Cannot generate mutation', e)
    throw new Error(`Error on query generation\n${e.toString()}`)
  }
}
