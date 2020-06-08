import { AosEntityFields, AosFieldType } from '@/abstractObjectSchema'
import { GetFieldType } from './repository/controls/types'

/** Generate getter of type based on declarated entity types */
export const genGetFieldType = (fields: AosEntityFields): GetFieldType => {
  const getTypeFromFields: GetFieldType = name => {
    const field = fields[name]

    if (typeof field === 'object')
      return field.type

    return field
  }

  return name => {
    // need wrap real type to correct postgraphile behaivor,
    // TODO: move this to postgraphile adapter
    const type = getTypeFromFields(name)
    return handleListSourceType(type)
  }
}

/**
 * When some fild declarated as OneToMany,
 * it mean field actually contain list source,
 * which contain node array with actual One to Many entities (in case of Postgraphile),
 * to apply this behaivor need return Service field
 * @param type - declarated field type
 */
function handleListSourceType(type: AosFieldType): AosFieldType {
  if (type === AosFieldType.OneToMany)
    return AosFieldType.Service

  return type
}
