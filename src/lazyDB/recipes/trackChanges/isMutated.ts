import { wrapInProducer } from '@/lazyDB/core/wrap'
import { AtomicModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/atomic'
import { getStore, isProducer } from '@/lazyDB/core/common'
import { receiveWithMemoryAndReducers } from '@/lazyDB/core/receiver'
import { ModelEventTypes } from '@/lazyDB/database/events'
import { isChanged } from '@/lazyDB/database/states'
import { genSetter } from './onSet'

const simpleSetter = genSetter((store, prop, value) => {
  store.base[prop] = value
  return true
})

/**
 * Will return boolean if draft was changed
 * @param base - object which will wraped to track
 * @param changer - callback which will receive trackable base object
 */
export function isMutated<T extends object>(base: T, changer: (draft: T) => void): boolean {
  const producer = wrapInProducer(base, new AtomicModelEventDispatcher())

  const store = getStore(producer)!
  store.setter = simpleSetter

  receiveWithMemoryAndReducers(store, {
    [ModelEventTypes.GetProperty]() { return true },
    [ModelEventTypes.SetProperty](_, { payload: { oldValue, newValue } }) {
      return oldValue === newValue
    },
    [ModelEventTypes.DeleteProperty]() { return false }
  })

  changer(producer as T)

  return isChanged(store.memory!)
}
