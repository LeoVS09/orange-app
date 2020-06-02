import gql from 'graphql-tag'
import * as builder from 'gql-query-builder'
import { QueryFields } from './types'
import { PrettyQueryAdapter } from './prettyQueryAdapter'

export * from './types'

export interface QueryEntityByIdGenerated {
  query: any,
  name: string
}

export function generateQueryEntityById(entity: string, fields: QueryFields): QueryEntityByIdGenerated {
  try {
    const { query } = builder.query({
      operation: entity,
      fields,
      variables: { id: { type: 'UUID', value: 1, required: true } }
    }, PrettyQueryAdapter)

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

  const { query } = builder.query({
    operation: listName,
    fields
  }, PrettyQueryAdapter)

  console.debug('[QueryMapper] generated query', query)
  return { query: gql(query), name: listName }
}

function entityToList(entity: string): string {
  if (entity.slice(-1) === 'y')
    return `${entity.slice(0, -1)}ies`

  return `${entity}s`
}
