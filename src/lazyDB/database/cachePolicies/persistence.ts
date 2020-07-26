import { AosSchema } from '@/abstractObjectSchema'

// not check for just undefined, to avoid cache object or other not simple types
const cacheFieldTypes = ['number', 'boolean', 'string']

/**
 * Will filter schema fields by exited in object
 * filter only first level of object, to not cache links to other objects
 * */
export const persistenceEntityFieldsCachePolicy = <T extends {[key: string]: any}>(
  base: T,
  /** fields which will not be cached */
  exceptions: Array<string> = []
) => (schema: AosSchema): AosSchema => {
    const result: AosSchema = {}

    Object.keys(schema)
      .filter(key => exceptions.includes(key) || !cacheFieldTypes.includes(typeof base[key]))
      .forEach(key => {
        result[key] = schema[key]
      })

    return result
  }
