import { ProducerStoreSetter, IProducerStore } from '@/lazyDB/core/types'
import { wrapInProducer } from '@/lazyDB/core/wrap'
import { AtomicModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/atomic'
import { getStore, isProducer } from '@/lazyDB/core/common'

type Setter = ProducerStoreSetter<IProducerStore<any, any>>

/**
 * Will gen setter which allow add additional behaivor on standart setter
 * @param onSetHook - in base case just `store.base[prop] = value`
 */
export const genSetter = (onSetHook: Setter): Setter => {
  const setter: Setter = (store, prop, value) => {
    // Not change actual object when lazy core try set it
    if (!isProducer(value))
      return onSetHook(store, prop, value) // `store.base[prop] = value`

    const valueStore = getStore(value)!
    // push this setter to allow all produced object exists
    valueStore.setter = setter
    return true
  }

  return setter
}

/**
 * Wrap object and return trackable value,
 * and call onSetHook each time when some try set value to tracked object
 * hook must literally call `store.base[prop] = value`, it need if you want allow change real value
 * @param base - object which will be wrapped to track
 * @param onSetHook - callback which will be called each time when someone try set a property
 */
export function onSet<T extends object>(base: T, onSetHook: Setter): T {
  const producer = wrapInProducer(base, new AtomicModelEventDispatcher())

  const store = getStore(producer)!

  store.setter = genSetter(onSetHook)

  return producer as T
}
