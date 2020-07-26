import { EventReducersMap, ModelEvent, ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { ModelEventTypes, DatabaseModelTypesToPayloadsMap } from '../../../events'
import { IDatabaseModelProducerStore } from '../../../types'
import { isExcludeProperty } from '../../../base/exclideProperty'
import read from './read'
import update from './update'

export const databaseReducers: EventReducersMap<IDatabaseModelProducerStore, DatabaseModelTypesToPayloadsMap> = {
  [ModelEventTypes.GetProperty]: (root, { payload }: ModelEvent<ModelEventGetPropertyPayload>) => {
    if (isExcludeProperty(payload.name, root.excludeProperties))
      return true

    return false
  },

  [ModelEventTypes.SetProperty]: () => false,

  [ModelEventTypes.DeleteProperty]: () => false,

  // Add ts support for inner read payload
  [ModelEventTypes.Read]: read,

  [ModelEventTypes.Update]: update,

  [ModelEventTypes.Create]: () => false,

  [ModelEventTypes.Delete]: () => false,

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

