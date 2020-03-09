import {
  EventReducer,
  ModelEventInnerPayload,
  AbstractData,
  EventProducer
} from '@/lazyDB/core/types'
import { ReadSuccessEventPayload } from '@/lazyDB/database/events'
import { isObject, isDate } from './utils'
import { getInnerInnerPayload } from './types'

const readSuccess: EventReducer<ModelEventInnerPayload<ModelEventInnerPayload<ReadSuccessEventPayload>>> = (_, payload) => {

  const { data, store } = getInnerInnerPayload(payload)
  const { base, proxy } = store

  console.log('[databaseReducers]', 'read success data', data)

  setEntity(proxy!, data)

  console.log('[databaseReducers]', 'ModelEventTypes.ReadSuccess', base, data)

  return true
}

export default readSuccess

const setEntity = (model: EventProducer, received: AbstractData) => {
  for (const key of Object.keys(received))
    model[key] = received[key]

}
