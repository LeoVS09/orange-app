import {
  EventReducersMap, BaseEventsPayloads, ModelEvent, ModelEventGetPropertyPayload
} from '@/lazyDB/core/types'
import {
  ModelEventTypes,
  DatabaseModelTypesToPayloadsMap
} from '../../../events'
import { IDatabaseModelProducerStore } from '../../../types'
import {
  isExcludeProperty
} from '../../../base/exclideProperty'

import read from './read'

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

  [ModelEventTypes.Success]: (store, payload) => {
    console.log('Success', store, payload)
    return true
  },

  [ModelEventTypes.Failure]: (store, { payload }) => {
    console.error('Failed', payload.event.type, { store, payload }, payload.error)
    // TODO: handle error
    return false
  }
}

