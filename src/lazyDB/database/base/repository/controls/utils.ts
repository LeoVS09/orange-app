import { AosEntityFields, AosFieldType } from '@/abstractObjectSchema'

export const getFieldType = (fields: AosEntityFields, name: string): AosFieldType => {
  const field = fields[name]

  if (typeof field === 'object')
    return field.type

  return field
}

