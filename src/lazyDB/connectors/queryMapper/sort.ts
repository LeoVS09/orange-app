import { QueryField, isQueryField } from './types'

const ID_KEY = 'id'
/**
 * Sort fields, for make queries more determenistic
 * Will pass id on top of query, and other fields in order on page
 * Id fields sorted, based on index of id inside word
 * result will looks like ['id', 'nodeId', 'otherId', ... other fields]
 * @param a - first field
 * @param b - second field
 */
const sortFields = (a: string | QueryField, b: string | QueryField): number => {

  // if each field not simple, then order not important
  if (typeof a !== 'string' && typeof b !== 'string')
    return 0

  // if only second field is simple, then second field will be upper
  if (typeof a !== 'string')
    return 1

  // if only first field is simple, then first field will be upper
  if (typeof b !== 'string')
    return -1

  const aId = a.toLowerCase().indexOf(ID_KEY)
  const bId = b.toLowerCase().indexOf(ID_KEY)

  // if they not have id, then order not important
  if (aId === -1 && bId === -1)
    return 0

  // if they all have id, then first 'id' in word will be upper in query
  if (aId !== -1 && bId !== -1)
    return aId - bId

  // if only first have id, then first word will be upper
  if (aId !== -1)
    return -1

  // if only second have id, then second word will be upper
  return 1
}

/** Redursivly sort array of field values */
export function sortFieldValues(field: string | QueryField) {
  if (!isQueryField(field))
    return

  // field values array
  const values = Object.values(field)[0]

  values
    .sort(sortFields)
    .forEach(inner => sortFieldValues(inner))
}
