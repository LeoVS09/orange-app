import { AosSchema } from '@/abstractObjectSchema'
import { GenerateQueryOptions, generateQuery } from './generateQuery'
import { schemaToQueryFields } from './schemaToQuery'

export * from './types'
export * from './schemaToQuery'
export * from './generateQuery'

export interface GenerateQueryFromAosSchemaOptions extends Omit<GenerateQueryOptions, 'fields'> {
    /** fields which will be inside query */
    schema: AosSchema
  }

/** Generate query from AOS schema, for more info check generateQuery function */
export const generateQueryFromAosSchema = ({ operation, schema, variables }: GenerateQueryFromAosSchemaOptions) =>
  generateQuery({
    operation,
    fields: schemaToQueryFields(schema),
    variables
  })
