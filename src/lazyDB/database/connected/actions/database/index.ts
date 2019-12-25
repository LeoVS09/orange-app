import {
  ModelEventTypes,
  ReadFailureEventPayload,
} from '../../../events'
import {
  EventReducersMap,
} from '@/lazyDB/core/types'
import { IDatabaseModelProducerStore } from '../../../types'
import {
  isExcludeProperty,
} from '../utils'

import read from './read'
import readSuccess from './readSuccess'

export const databaseReducers: EventReducersMap = {
  [ModelEventTypes.GetProperty]: (store, payload) => {
    if (isExcludeProperty(store as IDatabaseModelProducerStore, payload))
      return true

    return false
  },

  [ModelEventTypes.SetProperty]: () => false,

  [ModelEventTypes.DeleteProperty]: () => false,

  // Add ts support for inner read payload
  [ModelEventTypes.Read]: read,

  [ModelEventTypes.ReadSuccess]: readSuccess,

  [ModelEventTypes.ReadFailure]: ({ base }, { error }: ReadFailureEventPayload) => {
    console.error(base, error)
    // TODO: handle error
    return false
  },
}

