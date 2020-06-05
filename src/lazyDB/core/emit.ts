import { PropertyEventType, EventProducer } from './types'
import { getStore } from './common'

/** Emit some event on model */
export const emit = (producer: EventProducer<any> | any, type: string | PropertyEventType, payload?: any) => {
  const store = getStore(producer)
  if (!store) {
    console.warn('Cannot emit event', type, 'on not producer', producer)
    return
  }

  const { dispatcher } = store

  dispatcher.dispatch(type, payload)
}
