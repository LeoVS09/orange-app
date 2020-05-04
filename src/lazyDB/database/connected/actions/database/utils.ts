import { AosSchema, isSimpleAosField } from '@/abstractObjectScheme'
import { QueryField } from '@/lazyDB/connectors/queryMapper'
import { ReadEventPayload } from '@/lazyDB/database/events'
import { AbstractData } from '@/lazyDB/core/types'

// TODO: multiple types of object schema, need better solution
export function schemaToQueryFields(schema: AosSchema): Array<string | QueryField> {
  const keys = Object.keys(schema)

  return keys.map(key => {
    const field = schema[key]
    if (isSimpleAosField(field))
      return key

    return {
      entity: key,
      type: field.type,
      fields: schemaToQueryFields(field.schema)
    }
  })
}

export const removeGetEventsFromMemory = ({ store, gets }: ReadEventPayload) => {
  const { memory } = store

  if (memory)
    memory.forget(...gets)
}

export const dispatchReadSuccess = (readPayload: ReadEventPayload, responseData: AbstractData) => {
  const { store } = readPayload
  const { dispatcher } = store
  dispatcher.readSuccess(responseData, readPayload, store)
}

export const dispatchReadFailure = (readPayload: ReadEventPayload, error: any) => {
  const { store } = readPayload
  const { dispatcher } = store
  dispatcher.readFailure(error, readPayload, store)
}

export const isObject = (value: any): value is Object => typeof value === 'object'
export const isDate = (value: any): value is Date => value instanceof Date
