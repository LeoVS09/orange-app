import { FieldToken } from '@/lazyDB/core/aos'
import { AosFieldType } from '@/abstractObjectSchema'

/** Add required for entity fields, like `id` */
export function addEntityFields(tokens: Array<FieldToken>, additionalEntityFields: Array<FieldToken>) {
  if (!isLastEntityToken(tokens))
    return tokens

  // add required fields,
  // like id for lazyDb service needs
  return [...tokens, ...additionalEntityFields]
}

const isLastEntityToken = (tokens: Array<FieldToken>) => {
  // no one tokens pushed, not sure it entity or not
  if (tokens.length < 1)
    return false

  const [{ type: last }] = tokens.slice(-1)

  // if last entity is service, then not need add entity fields
  if (last === AosFieldType.Service)
    return false

  // entity tokens will be added inside many field
  if (last === AosFieldType.OneToMany)
    return true

  // If tokens length less than 2, then will think root is entity
  if (tokens.length < 2)
    return true

  const [{ type: preLast }] = tokens.slice(-2)

  // if last or second-to-last token wasn't entity, then not need add fields
  if (![preLast, last].includes(AosFieldType.OneToOne))
    return false

  return true
}

