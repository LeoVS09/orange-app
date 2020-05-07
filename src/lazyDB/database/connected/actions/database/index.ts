import {
  EventReducersMap, ModelEventInnerPayload
} from '@/lazyDB/core/types'
import {
  ModelEventTypes,
  ReadFailureEventPayload
} from '../../../events'
import { IDatabaseModelProducerStore } from '../../../types'
import {
  isExcludeProperty
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

  [ModelEventTypes.ReadFailure]: (store, payload: ModelEventInnerPayload<ModelEventInnerPayload<ReadFailureEventPayload>>) => {
    const fail = (payload.inner && payload.inner.inner && payload.inner.inner || {}) as ReadFailureEventPayload
    console.error('Failed to read\n', fail.error, store)
    // TODO: handle error
    return false
  }
}

