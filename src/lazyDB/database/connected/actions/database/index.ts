import {
  EventReducersMap, BaseEventsPayloads, ModelEvent, ModelEventGetPropertyPayload
} from '@/lazyDB/core/types'
import {
  ModelEventTypes,
  ReadFailureEventPayload,
  ModelEventReadPayload,
  ReadSuccessEventPayload,
  DatabaseModelTypesToPayloadsMap
} from '../../../events'
import { IDatabaseModelProducerStore } from '../../../types'
import {
  isExcludeProperty
} from '../../../base/exclideProperty'

import read from './read'
import readSuccess from './readSuccess'

export const databaseReducers: EventReducersMap<IDatabaseModelProducerStore, DatabaseModelTypesToPayloadsMap> = {
  [ModelEventTypes.GetProperty]: (store, { payload }: ModelEvent<ModelEventGetPropertyPayload>) => {
    if (isExcludeProperty(store as IDatabaseModelProducerStore, payload))
      return true

    return false
  },

  [ModelEventTypes.SetProperty]: () => false,

  [ModelEventTypes.DeleteProperty]: () => false,

  // Add ts support for inner read payload
  [ModelEventTypes.Read]: read,

  [ModelEventTypes.ReadSuccess]: readSuccess,

  [ModelEventTypes.ReadFailure]: (store, { payload }) => {
    console.error('Failed to read\n', payload.error, store)
    // TODO: handle error
    return false
  }
}

