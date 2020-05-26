import {
  EventReducer,
  IProducerStore
} from '@/lazyDB/core/types'
import { ReadSuccessEventPayload, ModelEventReadPayload } from '@/lazyDB/database/events'
import { DatabaseEventReducer, IDatabaseModelProducerStore } from '@/lazyDB/database/types'

const readSuccess: DatabaseEventReducer<IDatabaseModelProducerStore, ReadSuccessEventPayload> = (_, { payload }) => {

  const { data, store, readPayload } = payload
  const { base, proxy } = store

  console.log('[databaseReducers]', 'read success data', data)

  Object.assign(proxy, data)

  removeReadEventFromMemmory(store, readPayload)

  console.log('[databaseReducers]', 'ModelEventTypes.ReadSuccess', base, data)

  return true
}

export default readSuccess

const removeReadEventFromMemmory = ({ memory }: IProducerStore, readPayload: ModelEventReadPayload) => {
  memory!.forget(({ payload }) => payload === readPayload)
}
