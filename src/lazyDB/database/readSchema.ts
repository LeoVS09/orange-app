import { ModelEventGetPropertyPayload, ModelEventInnerPayload } from '@/lazyDB/core/types'
import { nodesKey } from '@/lazyDB/database/types'
import {
  AosSchema,
  AosFieldType,
  isRelationsAosField,
  isSimpleType,
  AosSimpleField,
  AosField,
  AosRelationsField
} from '@/abstractObjectScheme'
import { requiredFields } from '../constants'

export function appendPropertyToSchema(
  schema: AosSchema,
  {
    name,
    inner,
    type
  }: ModelEventGetPropertyPayload
): boolean {
  name = toNumberIfCan(name)

  if (typeof name === 'number')
    return appendNumberPropertyToSchema(schema, name, inner)

  if (!inner) {
    const isAppended = appendSimplePropertyToSchema(schema, name, type)
    // if some one asks one simple field on object
    // append required field
    // must be after first execution, to return correct isAppended result
    appendRequiredPropertiesToSchema(schema)
    return isAppended
  }

  const { property, isCreated } = getOrCreateSchemaFieldProperty(schema, name, inner)

  if (property.type !== AosFieldType.OneToMany)
    return appendPropertyToSchema(property.schema, inner)

  if (inner.inner)
    return appendPropertyToSchema(property.schema, inner.inner)

  return isCreated
}

// Will append all requied simple fields if they need
function appendRequiredPropertiesToSchema(schema: AosSchema) {
  for (const name of requiredFields)
    appendSimplePropertyToSchema(schema, name, AosFieldType.Any)
}

function appendNumberPropertyToSchema(
  schema: AosSchema,
  name: number,
  inner: ModelEventInnerPayload<any> | undefined
): boolean {
  if (!inner)
    return false

  return appendPropertyToSchema(schema, inner)
}

function appendSimplePropertyToSchema(
  schema: AosSchema,
  name: string,
  type: AosFieldType
): boolean {
  if (schema[name])
    return false

  if (isSimpleType(type)) {
    const field: AosSimpleField = { type }
    schema[name] = field
    return true
  }

  return false
}

export interface GetOrCreateSchemaFieldResult {
  property: AosRelationsField
  isCreated: boolean
}

function getOrCreateSchemaFieldProperty(
  schema: AosSchema,
  name: string,
  inner: ModelEventInnerPayload<any>
): GetOrCreateSchemaFieldResult {
  let property = schema[name]
  if (property && isRelationsAosField(property))
    return { property, isCreated: false }

  property = schema[name] = {
    // Hack for graphql
    // TODO: remove
    type: inner.name === nodesKey
      ? AosFieldType.OneToMany
      : AosFieldType.OneToOne,
    schema: {}
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
