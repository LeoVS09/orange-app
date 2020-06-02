import { EventReducer, ModelEventSetPropertyPayload } from '@/lazyDB/core/types'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '@/lazyDB/database/types'
import { getOrCreateSchema, appendEventToSchema } from '@/lazyDB/database/aos'
import { isWasChaged } from '@/lazyDB/receipes/trackChanges'

export const set: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventSetPropertyPayload> = (store, { payload, date }) => {
  console.log('repositoryReducers', 'SetProperty', 'event:', payload, 'store:', store)
  if (isExcludeProperty(store, payload))
    return true

  const schema = getOrCreateSchema(store)

  const isChanged = isWasChaged(
    schema,
    trackable => appendEventToSchema({
      schema: trackable,
      event: payload,
      resolvedAt: date
    })
  )

  // resolved if was not changed
  return !isChanged
}

export default set
