import { ModelEventSetPropertyPayload } from '@/lazyDB/core/types'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '@/lazyDB/database/types'
import { getOrCreateSchema, appendEventToSchema, getAbsolutePath } from '@/lazyDB/core/aos'
import { transformTokensForSet } from './transformTokens'

/** Default reducer for set events produced from models */
export const set: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventSetPropertyPayload> = (root, { payload, date }) => {
  console.log('[RepositoryReducers] SetProperty event:', payload, 'store:', root)
  if (isExcludeProperty(root, payload))
    return true

  console.log(`SET ${getAbsolutePath(payload.store)}.${payload.name}`)

  const schema = getOrCreateSchema(root)

  appendEventToSchema({
    schema,
    event: payload,
    transformTokens: transformTokensForSet()
  })

  // need just store set event,
  // to spawn update event when need
  // and allow return previous value
  return false
}

export default set
