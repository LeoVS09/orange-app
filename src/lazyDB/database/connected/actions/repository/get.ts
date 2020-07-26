import { ModelEventGetPropertyPayload } from '@/lazyDB/core/types'
import { getAbsolutePath } from '@/lazyDB/core/aos'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '../../../types'
import { GetEventAosParser } from './parsers/get'

/** Default reducer for get events produced from models */
const get: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventGetPropertyPayload> = (root, { payload }) => {
  console.log('[RepositoryReducers]', 'GetProperty', 'event:', payload, 'store:', root)
  if (isExcludeProperty(payload.name, root.excludeProperties))
    return true

  // Will find schema in tree, where better store event
  const parser = new GetEventAosParser(payload.store, root)
  // and append event
  const isAppended = parser.append(payload)

  if (isAppended)
    console.log(`[GET] ${getAbsolutePath(payload.store)}.${payload.name}`)

  // if action was not change anything
  // then it possible was already done, or not have any impact value
  // so not need store it in memory
  return !isAppended
}

export default get

