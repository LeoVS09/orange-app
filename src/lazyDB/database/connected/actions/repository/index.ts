import { EventReducersMap } from '@/lazyDB/core/types'
import { ModelEventTypes } from '../../../events'

import get from './get'

export const repositoryReducers: EventReducersMap = {
  [ModelEventTypes.GetProperty]: get,

  [ModelEventTypes.SetProperty]: () => false,

  [ModelEventTypes.DeleteProperty]: () => false,
}
