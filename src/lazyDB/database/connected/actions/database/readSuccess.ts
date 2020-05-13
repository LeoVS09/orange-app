import {
  EventReducer,
  ModelEventInnerPayload,
  AbstractData,
  EventProducer,
  IProducerStore
} from '@/lazyDB/core/types'
import { ReadSuccessEventPayload, ReadEventPayload } from '@/lazyDB/database/events'
import { getInnerInnerPayload } from './types'

const readSuccess: EventReducer<ModelEventInnerPayload<ModelEventInnerPayload<ReadSuccessEventPayload>>> = (_, payload) => {

  const { data, store, readPayload } = getInnerInnerPayload(payload)
  const { base, proxy } = store

  console.log('[databaseReducers]', 'read success data', data)

  Object.assign(proxy, data)

  removeReadEventFromMemmory(store, readPayload)

  console.log('[databaseReducers]', 'ModelEventTypes.ReadSuccess', base, data)

  return true
}

export default readSuccess

const removeReadEventFromMemmory = ({ memory }: IProducerStore, readPayload: ReadEventPayload) => {
  memory!.forget(({ payload }) => payload === readPayload)
}
