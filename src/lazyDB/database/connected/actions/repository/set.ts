import { ModelEventSetPropertyPayload } from '@/lazyDB/core/types'
import { isExcludeProperty } from '@/lazyDB/database/base/exclideProperty'
import { IDatabaseModelProducerStore, DatabaseEventReducer } from '@/lazyDB/database/types'
import { getOrCreateSchema, appendEventToSchema } from '@/lazyDB/database/aos'
import { onSet } from '@/lazyDB/recipes/trackChanges/onSet'
import { AosSchema } from '@/abstractObjectSchema'
import { transformTokensForSet } from './transformTokens'

export const set: DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventSetPropertyPayload> = (store, { payload, date }) => {
  console.log('[RepositoryReducers] SetProperty event:', payload, 'store:', store)
  if (isExcludeProperty(store, payload))
    return true

  const schema = getOrCreateSchema(store)

  let isWasResolved = false
  const trackable = onResolveSetHook(schema, () =>
    isWasResolved = true
  )

  appendEventToSchema({
    schema: trackable,
    event: payload,
    transformTokens: transformTokensForSet(),
    resolvedAt: date
  })

  // if set event wasn't resolved
  // then will think it event was spawned
  // when read action received value
  //
  // if action was resolved before
  // then need just store set event,
  // to spawn update event when need
  // and allow return previous value
  return !isWasResolved
}

const onResolveSetHook = (schema: AosSchema, onResovle: () => void) =>
  onSet(schema, (store, prop, value) => {
    const oldValue = store.base[prop]

    if (prop === 'resolvedAt' && oldValue) {
    // if old value for resolvedAt exists,
    // then property was resolved before
      onResovle()
      return true
    }

    // if was not resolved, then we can set new value
    store.base[prop] = value
    return true
  })

export default set
