import { ModelEventPropertyPayload } from '@/lazyDB/core/types'
import {
  AosSchema,
  AosFieldType
} from '@/abstractObjectSchema'
import { append } from './parser'
import { compudeStoreParents, FieldToken } from './tokenizer'
import { toNumberIfCan } from './utils'

/**
 * Simple compiler function, append new event to existing AOS Schema
 * working by simple phases
 * 1. Travel by event path to root node, and build fields array
 * 2. Go step by step through fields array, and append each field into AOS Schema
 * @param schema - AOS Schema which will be mutated
 * @param event - inital proprety event, wich will be used
 */

export interface TransformTokensList {
  (tokens: Array<FieldToken>): Array<FieldToken>
}

export interface AppendEventToSchemaOptions {
  schema: AosSchema
  event: ModelEventPropertyPayload
  resolvedAt?: number | null
  transformTokens?: TransformTokensList
}

export function appendEventToSchema({
  schema,
  event: { name, type, store },
  resolvedAt = null,
  transformTokens = list => list
}: AppendEventToSchemaOptions) {
  // Travel from target node to root
  // and build event path
  const path = [...compudeStoreParents(store)]

  // Make AOS tokens array,
  // in view like we travle from root of AOS schema to this this field
  const prepared = [
    // reverse path for start from root
    ...path.reverse(),
    // and append event as inital field
    { name, type }
  ]

  // Will append all requied fields or remove unnecessary
  const tokens = transformTokens(prepared)
    // in schema number tokens not exists,
    // TODO: need another solution, because fails if token digit id
    .filter(token => !isNumberFieldToken(token))
  console.debug('[AppendPropertyToSchema] aos tokens, based on event path', { tokens, store, schema })

  // Append each token to schema
  // step by step, from root node (as first token) to last field
  append(schema, tokens, resolvedAt)
  console.debug('[AppendPropertyToSchema] builded schema', { schema })
}
// Check is token is number literal, it mean parent was array
function isNumberFieldToken({ name }: FieldToken) {
  const parsedNumber = toNumberIfCan(name)
  return typeof parsedNumber === 'number'
}

