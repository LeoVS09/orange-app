import { AosEntityFields, AosFieldType } from '@/abstractObjectSchema'
import { GetFieldType } from './repository/controls/types'

export const genGetFieldType = (fields: AosEntityFields): GetFieldType => name => {
  const field = fields[name]

  if (typeof field === 'object')
    return field.type

  return field
}

