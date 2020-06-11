import { AosEntityFields, AosFieldType } from '@/abstractObjectSchema'
import { extractEntityNameFromManyKey } from '@/lazyDB/utils'

export const getTableNameByField = (fields: AosEntityFields, name: string): string => {
  const field = fields[name]

  if (typeof field === 'object' && field.table)
    return field.table

  if (field === AosFieldType.OneToMany)
    return extractEntityNameFromManyKey(name)

  return name
}

