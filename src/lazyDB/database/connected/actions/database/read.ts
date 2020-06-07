import { ModelEventReadPayload } from '@/lazyDB/database/events'
import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { compudeStoreParents, FieldToken } from '@/lazyDB/core/aos'
import { fetchListOrEntity } from '@/lazyDB/adapters/postgraphile'

type ReadReducer = DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventReadPayload<IDatabaseModelProducerStore>>

const read: ReadReducer = async (root, { payload: { store, gets } }, control) => {
  const { schema } = store
  if (!schema) {
    console.error('read producer not have read schema', { store, gets })
    throw new Error('Read producer not have read schema')
  }
  // TODO: create lazy array
  const [{ name: key }, { name: entity }] = [...compudeStoreParents(store)] as Array<FieldToken<string>>

  console.log('[ReadActiont] generate request for', `${key}/${entity}/`)

  const data = await fetchListOrEntity(key, entity, schema)
  console.log('[ReadActiont] response', data)

  // Will set data end remove all get events for which data was received
  Object.assign(control, data)

  return true
}

export default read
