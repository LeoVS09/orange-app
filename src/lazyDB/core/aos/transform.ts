import { isSimpleType } from '@/abstractObjectSchema'
import { FieldToken } from './tokenizer'
import { ParserToken } from './builder'
import { SimpleField, RelationsField } from './fields'

/**
 * Default variation of function to transform `FieldTokens` to `ParserToken`
 * Can be overridden to make additional changes with result tree
 * */
export const fieldTokenToParser = ({ type, name, store }: FieldToken): ParserToken => {
  if (isSimpleType(type)) {
    return {
      name: name as string,
      value: new SimpleField(type)
    }
  }

  // then field is relational

  return {
    name: name as string,
    value: new RelationsField(type)
  }
}
