import { FieldToken, ParserToken } from '@/lazyDB/core/aos'
import { isListToken } from './gurads'
import { SuitableAosParser } from './suitable'

/** remove service tokens */
export class SetEventAosParser extends SuitableAosParser {
  protected transform(tokens: Array<FieldToken>): Array<ParserToken> {
    // remove table list field
    const clear = tokens.filter(token => !isListToken(token))
    return super.transform(clear)
  }
}
