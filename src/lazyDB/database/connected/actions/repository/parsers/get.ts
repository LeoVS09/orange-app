import { FieldToken, ParserToken } from '@/lazyDB/core/aos'
import { AosFieldType } from '@/abstractObjectSchema'
import { requiredFields } from '@/lazyDB/constants'
import { ModelEventPropertyPayload, IProducerStore } from '@/lazyDB/core/types'
import { isMutated } from '@/lazyDB/recipes/trackChanges/isMutated'
import { isListToken } from './gurads'
import { SuitableAosParser } from './suitable'
import { addEntityFields } from './addEntityFields'

// TODO: push requiredFields as options to database
const defaultAdditionalFields = requiredFields.map(field => ({ name: field, type: AosFieldType.Any }))

/** add additional fields on entity and remove service tokens */
export class GetEventAosParser extends SuitableAosParser {

  private additionalEntityFields: Array<FieldToken> = defaultAdditionalFields

  protected transform(tokens: Array<FieldToken>): Array<ParserToken> {
    // remove table list field
    const clear = tokens.filter(token => !isListToken(token))
    const result = addEntityFields(clear, this.additionalEntityFields)
    return super.transform(result)
  }

  append(event: ModelEventPropertyPayload<IProducerStore<any>>): boolean {
    // Track if schema was changed
    // when try append new event
    return isMutated(this.schema, trackable => {
      this.schema = trackable
      super.append(event)
    })
  }
}

