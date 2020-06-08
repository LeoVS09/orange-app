import { FieldToken, TransformTokensList } from '@/lazyDB/core/aos'
import { TableListKey } from '@/lazyDB/database/storage/table'
import { AosFieldType } from '@/abstractObjectSchema'

/** add additional fields on entity and remove service tokens */
export const transformTokensForGet = (additionalEntityFields: Array<FieldToken>): TransformTokensList => list => {
  const withoutServiceTokens = removeServiceTokens(list)
  return addEntityFields(withoutServiceTokens, additionalEntityFields)
}

/** remove service tokens */
export const transformTokensForSet = (): TransformTokensList => list =>
  removeServiceTokens(list)

/**
 * remove table list field,
 * it used by lazyDb as service name, not need in request schema
 * */
export const removeServiceTokens: TransformTokensList = list =>
  list.filter(({ name }) => name !== TableListKey)

/** Add required for entity fields, like `id` */
export function addEntityFields(tokens: Array<FieldToken>, additionalEntityFields: Array<FieldToken>) {
  const [preLast, last] = tokens.slice(-2)

  if (
    // if last or second-to-last token wasn't entity, then not need add fields
    ![preLast.type, last.type].includes(AosFieldType.OneToOne)
    // but if last entity is service, then it service, but not entity
    || last.type === AosFieldType.Service
  )
    return tokens

  // add required fields,
  // like id for lazyDb service needs
  return [...tokens, ...additionalEntityFields]
}
