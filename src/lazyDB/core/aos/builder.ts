import { AosSchema, isRelationsAosField, isRelationsType } from '@/abstractObjectSchema'
import { FieldToken } from './tokenizer'
import { RelationsField, SimpleField } from './fields'

/** Back-end token, which should be used as command for parser how to build schema */
export interface ParserToken {
  name: string
  value: RelationsField | SimpleField
}

/**
 * Travel by schema tree and append each token,
 * if it not exists
 * and mark his resolved field
 */
export function append(schema: AosSchema, tokens: Array<ParserToken>) {
  // start travel from schema root
  let current = schema

  for (const token of tokens)
    current = appendToken(current, token)

}

/** Append token to schema and get next schema step, for recursive update */
function appendToken(schema: AosSchema, { name, value }: ParserToken): AosSchema {
  // check is property already exists in schema
  const property = schema[name]

  // Field already exists and relational, go deeply into tree
  if (property && isRelationsAosField(property)) {
    // If token type wasn't realtions, just ignore it'
    if (!(value instanceof RelationsField)) {
      console.warn(
        '[AppendPropertyToSchema] proporty was marked as realtional,\n'
          + 'but received simple token\n',
        { name, value }, { property, schema },
        '\nwill ignore it'
      )
    }

    // go deeply in tree
    return property.schema
  }

  // Token type is relational, will append it and go deeply into tree
  if (value instanceof RelationsField) {
    // If property exists, but wasn't set as a relation
    if (property) {
      // will just rewrite correctly
      console.warn(
        '[AppendPropertyToSchema] property was marked as simple,\n'
          + 'but received realtions token', { name, value }, { property, schema },
        '\nwill rewirite it as relations'
      )
    }

    // Append relations field to tree
    const field = value
    schema[name] = field

    // go deeply into tree,
    // into newly created field
    return field.schema
  }

  // Not need add, field already exists
  // in case when we have multiple simple fields,
  // which stored continiusly into tokens array
  if (property)
    return schema

  // Field not exists and toke is simple
  // just append simple field to tree
  schema[name] = value
  return schema
}
