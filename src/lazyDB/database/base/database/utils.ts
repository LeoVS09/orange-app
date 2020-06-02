import { AosEntityFields } from '@/abstractObjectSchema'

export const getTableNameByField = (fields: AosEntityFields, name: string): string => {
  const field = fields[name]

  if (typeof field === 'object' && field.table)
    return field.table

  return name
}

