import { AosSchema, isSimpleAosField } from '@/abstractObjectSchema'
import { QueryFields } from './types'

/** Generate query fields from AOS schema */
export function schemaToQueryFields(schema: AosSchema): QueryFields {
  const keys = Object.keys(schema)

  return keys.map(key => {
    const field = schema[key]
    if (isSimpleAosField(field))
      return key

    return {
      [key]: schemaToQueryFields(field.schema)
    }
  })
}
