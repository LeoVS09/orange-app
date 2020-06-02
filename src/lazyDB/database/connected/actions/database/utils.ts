import { AosSchema, isSimpleAosField } from '@/abstractObjectSchema'
import { QueryFields } from '@/lazyDB/connectors/queryMapper'
import { ModelEventReadPayload } from '@/lazyDB/database/events'

// TODO: multiple types of object schema, need better solution
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

export const removeGetEventsFromMemory = ({ store, gets }: ModelEventReadPayload) => {
  const { memory } = store

  if (memory)
    memory.forget(...gets)
}

export const isObject = (value: any): value is Object => typeof value === 'object'
export const isDate = (value: any): value is Date => value instanceof Date
