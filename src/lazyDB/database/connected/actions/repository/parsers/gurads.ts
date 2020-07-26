import { FieldToken } from '@/lazyDB/core/aos'
import { TableListKey } from '@/lazyDB/database/storage/table'

/**
 * Decide if it list field,
 * it used by lazyDb as service name, not need in request schema
 * */
export const isListToken = ({ name }: FieldToken): boolean =>
  name === TableListKey
