import { FieldToken, TransformTokensList } from '@/lazyDB/database/aos'
import { TableListKey } from '@/lazyDB/database/storage/table'
import { AosFieldType } from '@/abstractObjectSchema'

const last = <T>(list: Array<T>): T => list[list.length - 1]

// remove table list field,
// it used by lazyDb as service name,
// not need in request schema
export const removeServiceTokens: TransformTokensList = list =>
  list.filter(({ name }) => name !== TableListKey)

/**
 * add additional fields on entity and remove service tokens
 */
export const transformTokensForGet = (additionalFields: Array<FieldToken>): TransformTokensList => list => {
  const withoutServiceTokens = removeServiceTokens(list)

  if (last(withoutServiceTokens).type === AosFieldType.OneToMany)
    return withoutServiceTokens

  // add required fields,
  // like id for lazyDb service needs
  return [...withoutServiceTokens, ...additionalFields]
}

/**
 * remove service tokens
 */
export const transformTokensForSet = (): TransformTokensList => list =>
  removeServiceTokens(list)

