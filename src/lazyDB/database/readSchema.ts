import { ModelReadSchema, ModelReadSchemaField } from '@/lazyDB/types'
import { isSchemaField } from '@/lazyDB/utils'
import { ModelAttributeType, ModelEventGetPropertyPayload, ModelEventInnerPayload } from '@/lazyDB/core/types'
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

  if (typeof name === 'number') 
    return appendNumberPropertyToSchema(schema, name, inner)

  if (!inner) 
    return appendSimplePropertyToSchema(schema, name, type)

  const { property, isCreated } = getOrCreateSchemaFieldProperty(schema, name, inner)

  if (property.type !== ModelAttributeType.OneToMany)
    return appendPropertyToSchema(property.fields, inner)

  if (inner.inner)
    return appendPropertyToSchema(property.fields, inner.inner)

  return isCreated
}

function appendNumberPropertyToSchema(
  schema: ModelReadSchema,
  name: number, 
  inner: ModelEventInnerPayload<any> | undefined
): boolean {
  if (!inner)
    return false

  return appendPropertyToSchema(schema, inner)
}

function appendSimplePropertyToSchema(
  schema: ModelReadSchema,
  name: string,
  type: ModelAttributeType
){
  if (schema[name])
    return false

  schema[name] = type
  return true
}

export interface GetOrCreateSchemaFieldResult {
  property: ModelReadSchemaField
  isCreated: boolean
}

function getOrCreateSchemaFieldProperty(
  schema: ModelReadSchema,
  name: string,
  inner: ModelEventInnerPayload<any>
): GetOrCreateSchemaFieldResult {
  let property = schema[name]
  if (property && isSchemaField(property)) 
    return { property, isCreated: false }

  property = schema[name] = {
    // Hack for graphql
    // TODO: remove
    type: inner.name === nodesKey
      ? ModelAttributeType.OneToMany
      : ModelAttributeType.OneToOne,
    fields: {},
  }
  return { property, isCreated: true }
}

export function toNumberIfCan(name: string | number | symbol): string | number {
  if (typeof name === 'number')
    return name

  const parsedNumber = Number.parseInt(name as string, 10)
  if (Number.isInteger(parsedNumber))
    return parsedNumber

  return name as string
}
