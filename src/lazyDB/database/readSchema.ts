import { ModelReadSchema} from '@/lazyDB/types'
import { isSchemaField} from '@/lazyDB/utils'
import { ModelEventGetPropertyPayload} from '@/lazyDB/core/types'

export function appendPropertyToSchema(schema: ModelReadSchema, { name, inner, type}: ModelEventGetPropertyPayload): boolean {
   if (!inner) {
      if (schema[name as string]) {
         return false
      }

      schema[name as string] = type
      return true
   }

   let property = schema[name as string]

   if (!property || !isSchemaField(property)) {
      property = schema[name as string] = {
         type,
         fields: { },
      }
   }

   return appendPropertyToSchema(property.fields, inner)
}
