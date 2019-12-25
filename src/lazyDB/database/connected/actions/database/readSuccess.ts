import { EventReducer, ModelEventInnerPayload } from '@/lazyDB/core/types'
import { ReadSuccessEventPayload } from '@/lazyDB/database/events'
import { isObject, isDate } from './utils'
import { getInnerInnerPayload } from './types'

const readSuccess: EventReducer<ModelEventInnerPayload<ModelEventInnerPayload<ReadSuccessEventPayload>>> = (_, payload) => {

  const { data, store } = getInnerInnerPayload(payload)
  const { base } = store

  console.log('databaseReducers', 'read success data', data)

  Object.keys(data)
    .forEach((key) => {
      if (!isObject(data[key]) || isDate(data[key])) {
        base[key] = data[key]
        return
      }

      const value = data[key]
      // TODO: add intellectual deep set
      Object.keys(value).forEach((valueKey) => {
        base[key][valueKey] = value[valueKey]
      })
    })

  console.log('databaseReducers', 'ModelEventTypes.ReadSuccess', base, data)

  return true
}

export default readSuccess
