import { AosEntityFields, AosFieldType } from '@/abstractObjectScheme'

export const getFieldType = (fields: AosEntityFields, name: string): AosFieldType => {
  const field = fields[name]

  if (typeof field === 'object')
    return field.type

  return field
}

export const getTableNameByField = (fields: AosEntityFields, name: string): string => {
  const field = fields[name]

  if (typeof field === 'object' && field.table)
    return field.table

  return name
}

