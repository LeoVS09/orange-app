import { EventReducersMap, ModelTypesToPayloadsMap } from '@/lazyDB/core/types'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { ModelEventTypes, DatabaseModelTypesToPayloadsMap } from '../../../events'

import get from './get'

export const repositoryReducers: EventReducersMap<IDatabaseModelProducerStore, ModelTypesToPayloadsMap<IDatabaseModelProducerStore<any, any>>> = {
  [ModelEventTypes.GetProperty]: get,

  [ModelEventTypes.SetProperty]: () => false,

  [ModelEventTypes.DeleteProperty]: () => false
}
