import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'; import { ModelEventUpdatePayload } from '@/lazyDB/database/events'
import { compudeStoreParents, FieldToken } from '@/lazyDB/core/aos'
import { updateEntity } from '@/lazyDB/adapters/postgraphile'
import { ModelEventSetPropertyPayload, ModelEvent } from '@/lazyDB/core/types'
import { ChangedFields } from '@/lazyDB/adapters/postgraphile/adapter'
import {
  appendSetEventsToPropertyCategory,
  byTime,
  SetEventsByProperty
} from '@/lazyDB/core/optimisation/zipper'

type UpdateReducer = DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventUpdatePayload<IDatabaseModelProducerStore>>

const last = <T>(list: Array<T>): T => list[list.length - 1]

export function setEventsToUpdatedFields(sets: Array<ModelEvent<ModelEventSetPropertyPayload>>): ChangedFields {
  const splited = sets
    .sort(byTime)
    .reduce(appendSetEventsToPropertyCategory, {} as SetEventsByProperty)

  const result: ChangedFields = {}
  for (const key of Object.keys(splited))
    result[key] = last(splited[key]).payload.newValue

  return result
}

export const update: UpdateReducer = async (root, { payload: { store, sets } }, control) => {
  const { schema } = store
  if (!schema) {
    console.error('update producer not have read schema', { store, sets })
    throw new Error('Update payload not have read schema')
  }

  const [{ name: key }, { name: entity }] = [...compudeStoreParents(store)] as Array<FieldToken<string>>

  const changedFields = setEventsToUpdatedFields(sets)

  console.log('[UpdateActiont] generate request for', `${key}/${entity}/`, 'changedFields', changedFields)

  const data = await updateEntity({
    key,
    entityName: entity,
    schema,
    changedFields
  })
  console.log('[UpdateActiont] response', data)

  // Will set data and remove all set and get events for which data was received
  Object.assign(control, data)

  return true
}

export default update
