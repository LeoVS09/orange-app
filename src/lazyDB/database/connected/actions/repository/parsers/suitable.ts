import { ModelEventPropertyPayload, IProducerStore } from '@/lazyDB/core/types'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import {
  AosParser,
  closest,
  getFieldType,
  FieldToken,
  ParserToken,
  SimpleField,
  RelationsField
} from '@/lazyDB/core/aos'
import { AosFieldType, isSimpleType } from '@/abstractObjectSchema'

/**
 * Will find node which must contain schema for given event
 * and create schema in node if need
 * then append event
 */
export class SuitableAosParser extends AosParser {

  entityStore: IDatabaseModelProducerStore

  /**
   * @param start - store from which start search where save schema
   * @param fallback - store which will be used if in tree wasn't found suitable store
   */
  constructor(start: IProducerStore<any>, fallback: IDatabaseModelProducerStore) {
    // create and save schema for each node individualy
    // it allow save schema for object when object asked from other repository
    // or from another page
    const entityStore = fintStoreWithSchema(start) || fallback
    const { schema } = entityStore
    if (!schema)
      throw new Error('Cannot create SuitableAosParser, no one node store have schema')

    super(schema)

    this.entityStore = entityStore

    this.transformToParserToken = transformToParserToken
  }

  append(event: ModelEventPropertyPayload<IProducerStore<any>>) {
    return super.append(event, this.entityStore)
  }

}

const closestFactory = (comparator: (store: IProducerStore) => boolean) => (
  store: IProducerStore<any>
): IDatabaseModelProducerStore | undefined =>
  // TODO: create more independent producer interface for remove `as`
  closest(store, comparator) as (IDatabaseModelProducerStore | undefined)

/**
 * Will return first store with schema
 * */
export const fintStoreWithSchema = closestFactory(store =>
  !!(store as IDatabaseModelProducerStore<any, any>).schema
)

const transformToParserToken = ({ name, type, store }: FieldToken): ParserToken => {
  if (isSimpleType(type)) {
    return {
      name: name as string,
      value: new SimpleField(type)
    }
  }

  // then field is relational
  const schema = (store && (store as IDatabaseModelProducerStore).schema) || {}

  return {
    name: name as string,
    value: new RelationsField(type, schema)
  }
}
