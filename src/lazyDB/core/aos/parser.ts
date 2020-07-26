import { ModelEventPropertyPayload, IProducerStore } from '@/lazyDB/core/types'
import { AosSchema } from '@/abstractObjectSchema'
import { append, ParserToken } from './builder'
import { compudeStoreParents, FieldToken } from './tokenizer'
import { toNumberIfCan } from './utils'
import { fieldTokenToParser } from './transform'

/**
 * Simple compiler function, append new event to existing AOS Schema
 * working by simple phases
 * 1. Travel by event path to root node, and build fields array
 * 2. Go step by step through fields array, and append each field into AOS Schema
 * @param schema - AOS Schema which will be mutated
 * @param event - inital proprety event, wich will be used
 */

export interface TransformTokensList {
  (tokens: Array<FieldToken>): Array<FieldToken>
}

/**
 * AosParser takes first phase of base compiler,
 * he can append given event to AosSchema
 * and also have three base phases which can be overridden
 */
export class AosParser {

  constructor(
    protected schema: AosSchema
  ) {}

  getSchema(): AosSchema {
    return this.schema
  }

  /**
   * First phase of parsing,
   * will take given event and build tokens path
   */
  protected buildTokens({ name, type, store }: ModelEventPropertyPayload, stop?: IProducerStore<any>): Array<FieldToken> {
    // Travel from target node to root
    // and build event path
    const path = [...compudeStoreParents(store, stop)]

    // Make AOS tokens array,
    // in representation like we travel from root of AOS schema to this this field
    return [
      // reverse path for start from root
      ...path.reverse(),
      // and append event as inital field
      // not add store, because in event exists store of producer,
      //  but not store of produced value
      { name, type }
    ]
  }

  /**
   * Second phase of parsing,
   * transform tokens from one representation to another,
   * in most cases need only to give additional filtration or mapping,
   * receive raw tokens, and return parser commands.
   * Splited into two methods to give more flexibility
   */
  protected transform(tokens: Array<FieldToken>): Array<ParserToken> {
    return tokens
      // in schema number tokens not exists,
      // beacause we think array can have only one entity type
      // TODO: need another solution, because fails if "token" digit enity id
      .filter(token => !isNumberToken(token))
      // base transformation to parser tokens,
      // will add any schema from stores which contain entity
      .map(this.transformToParserToken)
  }

  /** Used as final step in base transform phase, allow override this behaivor */
  protected transformToParserToken = fieldTokenToParser

  /**
   * Third phase of parsing,
   * Append each token to schema,
   * step by step, from root node (as first token) to last field
   */
  protected buildTree(tokens: Array<ParserToken>) {
    append(this.schema, tokens)
  }

  /**
   * Append given event to schema
   * @param event - property event which will be added to schema
   * @param root - declare on which store need stop calculate tokens hierarchy
   * */
  public append(
    event: ModelEventPropertyPayload,
    root?: IProducerStore<any>
  ) {
    const raw = this.buildTokens(event, root)
    console.debug('[AppendPropertyToSchema] aos tokens, based on event path', { raw, event, root }, this.schema)

    const prepared = this.transform(raw)

    this.buildTree(prepared)
    console.debug('[AppendPropertyToSchema] builded schema', { event }, this.schema)
  }

}

// Check is token is number literal, it mean parent was array
export function isNumberToken({ name }: FieldToken | ParserToken) {
  const parsedNumber = toNumberIfCan(name)
  return typeof parsedNumber === 'number'
}

