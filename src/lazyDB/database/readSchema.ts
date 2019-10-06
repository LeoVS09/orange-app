import { ModelReadSchema } from '@/lazyDB/types'
import { isSchemaField } from '@/lazyDB/utils'
import { ModelAttributeType, ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { nodesKey } from '@/lazyDB/database/types'

export function appendPropertyToSchema(
  schema: ModelReadSchema,
  {
    name,
    inner,
    type,
  }: ModelEventGetPropertyPayload,
): boolean {
  name = toNumberIfCan(name)

  if (typeof name === 'number') {
    if (!inner)
      return false

    return appendPropertyToSchema(schema, inner)
  }

  if (!inner) {
    if (schema[name])
      return false

    schema[name] = type
    return true
  }

  let property = schema[name]

  if (!property || !isSchemaField(property)) {
    property = schema[name] = {
      // Hack for graphql
      // TODO: remove
      type: inner.name === nodesKey
        ? ModelAttributeType.OneToMany
        : ModelAttributeType.OneToOne,
      fields: {},
    }
  }

  if (property.type !== ModelAttributeType.OneToMany)
    return appendPropertyToSchema(property.fields, inner)

  if (inner.inner)
    return appendPropertyToSchema(property.fields, inner.inner)

  return true
}

export function toNumberIfCan(name: string | number | symbol): string | number {
  if (typeof name === 'number')
    return name

  const parsedNumber = Number.parseInt(name as string, 10)
  if (Number.isInteger(parsedNumber))
    return parsedNumber

  return name as string
}
