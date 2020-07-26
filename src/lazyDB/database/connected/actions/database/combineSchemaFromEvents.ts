import {
  IDatabaseModelProducerStore,
  NodesProducerReference,
  nodesKey
} from '@/lazyDB/database/types'
import {
  IProducerStore,
  ModelEvent,
  ModelEventPropertyPayload
} from '@/lazyDB/core/types'
import {
  AosSchema,
  isSimpleType,
  AosFieldType,
  AosRelationsFieldType
} from '@/abstractObjectSchema'
import {
  FieldToken,
  AosParser,
  ParserToken,
  SimpleField,
  RelationsField
} from '@/lazyDB/core/aos'
import { isTemporalTrapProducer } from '@/lazyDB/database/base/repository/temporal'
import { getStore, isProducer } from '@/lazyDB/core/common'

// TODO: move this function inside class
export function combineSchemaFromEvents(
  root: IDatabaseModelProducerStore<any>,
  events: Array<ModelEvent<ModelEventPropertyPayload<IProducerStore<any>>>>,
  options: ImmutableCombineAosParserOptions = {}
): AosSchema | void {
  if (!root.schema)
    throw new Error('Cannot find schema in root')

  const parser = new ImmutableCombineAosParser(root.schema, options)

  for (const event of events)
    parser.append(event.payload, root)

  return parser.getSchema()
}

export interface ImmutableCombineAosParserOptions {
  /** Apped all simple fields from schemas of events */
  isNeedAppendSimpleFields?: boolean
}

export class ImmutableCombineAosParser extends AosParser {
  isNeedAppendSimpleFields: boolean

  constructor(schema: AosSchema, {
    isNeedAppendSimpleFields = false
  }: ImmutableCombineAosParserOptions = {}) {
    super(deepClone(schema))

    this.isNeedAppendSimpleFields = isNeedAppendSimpleFields
  }

  buildTokens(event: ModelEventPropertyPayload, stop?: IProducerStore<any>): Array<FieldToken> {
    const tokens = super.buildTokens(event, stop)
    // real build tokens not add store produced event
    // need extract it and append
    const value = getValueProducedInEvent(event)
    if (!isProducer(value))
      return tokens

    const store = getStore(value)!
    const [eventToken] = tokens.slice(-1)
    eventToken.store = store

    return tokens
  }

  transform(tokens: Array<FieldToken>): Array<ParserToken> {
    if (!this.isNeedAppendSimpleFields)
      return super.transform(tokens)

    const withSimple = appendSimpleTokens(tokens)
    return super.transform(withSimple)
  }

  transformToParserToken = ({ name, type, store }: FieldToken): ParserToken => ({
    name: name as string,
    value: buildTokenValue(name as string, type, store)
  })
}

function getValueProducedInEvent({ name, store: { base } }: ModelEventPropertyPayload): any {
  // exception for nodes in service store
  // TODO: when nodes will be remuved
  if (name === nodesKey)
    return base[NodesProducerReference]

  return base[name]
}

function appendSimpleTokens(tokens: Array<FieldToken>): Array<FieldToken> {
  const result = []
  let previusTokenStore: IProducerStore | undefined
  for (const token of tokens) {
    result.push(token)
    const { type, store } = token
    if (!isSimpleType(type)) {
      previusTokenStore = store
      continue
    }

    if (!previusTokenStore)
      continue

    const { schema } = previusTokenStore as IDatabaseModelProducerStore
    if (!schema)
      continue

    result.push(...genSimpleTokens(previusTokenStore as IDatabaseModelProducerStore, schema))
  }

  return result
}

function genSimpleTokens(store: IProducerStore, schema: AosSchema): Array<FieldToken> {
  const tokens: Array<FieldToken> = []
  for (const name of Object.keys(schema)) {
    const { type } = schema[name]
    if (!isSimpleType(type))
      continue

    tokens.push({
      name,
      type,
      store
    })
  }

  return tokens
}

function buildTokenValue(
  name: string,
  type: AosFieldType,
  store?: IProducerStore
): RelationsField | SimpleField {
  if (isSimpleType(type))
    return new SimpleField(type)

  const schema = getSchemaForRelationsToken(name as string, type, store)

  return new RelationsField(type, deepClone(schema))
}

function getSchemaForRelationsToken(prop: string, type: AosRelationsFieldType, store?: IProducerStore): AosSchema {
  if (!store)
    return {}

  if (type === AosFieldType.OneToMany)
    return getSchemaForManyToken(prop, store) || {}

  return (store as IDatabaseModelProducerStore).schema || {}
}

/**
 * if token was for One To Many, then schema for field inside trap
 * function will extract this schema if it exists
 */
function getSchemaForManyToken(prop: string, { base }: IProducerStore): AosSchema | void {
  if (!base || base.length !== 1)
    return

  const [first] = base
  if (!isTemporalTrapProducer(first))
    return

  const store = getStore(first)
  return (store as IDatabaseModelProducerStore).schema
}

export function deepClone<T extends object>(source: T): T {
  return JSON.parse(JSON.stringify(source))
}
