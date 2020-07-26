import { ModelEventReadPayload } from '@/lazyDB/database/events'
import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { compudeStoreParents, FieldToken, getAbsolutePath } from '@/lazyDB/core/aos'
import postgraphile from '@/lazyDB/adapters/postgraphile'
import { AosSchema } from '@/abstractObjectSchema'
import { isListKey } from '@/lazyDB/database/storage/table'
import { BackendAdapter } from '@/lazyDB/adapters/backend'
import { persistenceEntityFieldsCachePolicy } from '@/lazyDB/database/cachePolicies/persistence'
import { requiredFields } from '@/lazyDB/constants'
import { removeEventFromMemory, existsInMemory } from '@/lazyDB/core/receiver'
import { ModelEvent, ModelEventGetPropertyPayload, IProducerStore } from '@/lazyDB/core/types'
import { combineSchemaFromEvents } from './combineSchemaFromEvents'

type ReadReducer = DatabaseEventReducer<IDatabaseModelProducerStore, ModelEventReadPayload<IDatabaseModelProducerStore>>

const read: ReadReducer = async (root, { payload: { store, gets } }, control) => {
  const schema = combineSchemaFromEvents(store, gets, {
    isNeedAppendSimpleFields: true
  })
  if (!schema) {
    console.error('read producer not have read schema', { store, gets })
    throw new Error('Read producer not have read schema')
  }
  // TODO: create lazy array
  const [{ name: key }, { name: entityName }] = [...compudeStoreParents(store)] as Array<FieldToken<string>>

  console.log('[ReadActiont] generate request for', `${key}/${entityName}/`)

  // TODO: need allow configure cache policy
  const cachePolicy = persistenceEntityFieldsCachePolicy(store.base, requiredFields)

  // TODO: need allow configure adapter
  const data = await retrive(postgraphile, {
    key,
    entityName,
    schema,
    transformEntitySchema: cachePolicy
  })
  console.log('[ReadActiont] response', data)

  // Will set data end remove all get events for which data was received
  Object.assign(control, data)

  // prevent spawn cycle read event spawning
  // can be caused if returned not all data
  // or mostly often: bug in code which resolve events in control
  removeNotCompletedEvents(gets)

  return true
}

export default read

export interface RetriveOptions {
  key: string,
  entityName: string,
  schema: AosSchema
  /** Allow filter cached entity fields */
  transformEntitySchema?: (schema: AosSchema) => AosSchema
}

/**
 * Define what need to request, list or entity
 * @param key - id or list key
 * @param entityName - name of entity
 * */
// TODO: possible need not define it automatically
export function retrive(
  adapter: BackendAdapter,
  {
    key,
    entityName,
    schema,
    transformEntitySchema = s => s
  }: RetriveOptions
) {
  // Was asked list of entities
  if (isListKey(key))
    return adapter.getEntityList(entityName, schema)

  // Was asked one entity
  const retriveSchema = transformEntitySchema(schema)

  return adapter.getEntityById(entityName, key, retriveSchema)
}

function removeNotCompletedEvents(events: Array<ModelEvent<ModelEventGetPropertyPayload<IProducerStore>>>) {
  const notCompletedEvents = events.filter(existsInMemory)

  if (!notCompletedEvents.length)
    return

  console.warn(
    '[READ] Read was completed, but not all events which trigger read was removed, will remove it explicitly',
    `\n${notCompletedEvents.map(({ payload }) => `${getAbsolutePath(payload.store)}.${payload.name}`).join('\n')}`
  )

  notCompletedEvents.forEach(removeEventFromMemory)
}
