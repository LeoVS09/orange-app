import { wrapInProducer } from '../core/wrap'
import { AtomicModelEventDispatcher } from '../core/dispatcher/model/atomic'
import { getStore, isProducer } from '../core/common'
import { atomicReceiveWithMemory } from '../core/receiver'
import { ModelEventTypes } from '../database/events'
import { isChanged } from '../database/states'
import { ProducerStoreSetter, IProducerStore } from '../core/types'

const setter: ProducerStoreSetter<IProducerStore<any, any>> = (store, prop, value) => {
  // Not change actual object when lazy core try set it
  if (isProducer(value)) {
    const valueStore = getStore(value)!
    // push this setter to allow all produced object exists
    valueStore.setter = setter
    return true
  }

  store.base[prop] = value

  return true
}

export function isWasChaged<T extends object>(base: T, changer: (draft: T) => void) {
  const producer = wrapInProducer(base, new AtomicModelEventDispatcher())

  const store = getStore(producer)!
  store.setter = setter

  atomicReceiveWithMemory(store, {
    [ModelEventTypes.GetProperty]() { return true },
    [ModelEventTypes.SetProperty](_, { payload: { oldValue, newValue } }) {
      return oldValue === newValue
    },
    [ModelEventTypes.DeleteProperty]() { return false }
  })

  changer(producer as T)

  return isChanged(store.memory!)
}
