import { IDatabaseModelProducerStore } from '../../types'
import { ModelEventGetPropertyPayload, AbstractData } from '@/lazyDB/core/types'
import { lastObjectPropertyName } from '../../utils'
import { AosSchema, isSimpleAosField } from '@/abstractObjectScheme'
import { QueryField } from '@/lazyDB/connectors/queryMapper'
import { ReadEventPayload } from '../../events'

export function isExcludeProperty({ excludeProperties }: IDatabaseModelProducerStore, payload: ModelEventGetPropertyPayload) {
    if (!excludeProperties)
        return false

    const prop = lastObjectPropertyName(payload)

    return excludeProperties.includes(prop)
}

// TODO: multiple types of object schema, need better solution
export function schemaToQueryFields(schema: AosSchema): Array<string | QueryField> {
    const keys = Object.keys(schema)
  
    return keys.map((key) => {
      const field = schema[key]
      if (isSimpleAosField(field))
        return key
  
      return {
        entity: key,
        type: field.type,
        fields: schemaToQueryFields(field.schema),
      }
    })
  }
  

export const removeGetEventsFromMemory = ({ store, gets }: ReadEventPayload) => {
    const { memory } = store

    if (memory)
        memory.remove(...gets)
}

export const dispatchReadSuccess = ({ store }: ReadEventPayload, responseData: AbstractData) => {
    const { dispatcher } = store
    dispatcher.readSuccess(responseData, store)
}

export const dispatchReadFailure = ({ store }: ReadEventPayload, error: any) => {
    const { dispatcher } = store
    dispatcher.readFailure(error, store)
}