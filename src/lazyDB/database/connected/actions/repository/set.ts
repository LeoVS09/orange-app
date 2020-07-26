import { ModelEventSetPropertyPayload } from '@/lazyDB/core/types'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '@/lazyDB/database/types'
import { getAbsolutePath } from '@/lazyDB/core/aos'
import { SetEventAosParser } from './parsers/set'

/** Default reducer for set events produced from models */
export const set: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventSetPropertyPayload> = (root, { payload, date }) => {
  console.log('[RepositoryReducers] SetProperty event:', payload, 'store:', root)
  if (isExcludeProperty(payload.name, root.excludeProperties))
    return true

  console.log(`[SET] ${getAbsolutePath(payload.store)}.${payload.name}`)

  // Will find schema in tree, where better store event
  const parser = new SetEventAosParser(payload.store, root)
  // and append event
  parser.append(payload)

  // need allways store set event,
  // to spawn update event when need
  // and allow return previous value
  return false
}

export default set
