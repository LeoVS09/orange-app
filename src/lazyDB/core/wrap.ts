import { AsyncModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/async'
import { ProducerStore } from '@/lazyDB/core/Store'
import { isProducer } from '@/lazyDB/core/common'
import { arrayTraps, objectTraps } from '@/lazyDB/core/hooks/traps'
import {
  AbstractData,
  EventProducer,
  IModelEventDispatcher
} from './types'

export function wrapInProducer<T extends AbstractData = AbstractData>(
  base: T = { } as T,
  dispatcher: IModelEventDispatcher = new AsyncModelEventDispatcher()
): EventProducer {
  const store = new ProducerStore({
    base,
    dispatcher
  })

  const { proxy, revoke } = !Array.isArray(base)
    ? Proxy.revocable<AbstractData>(store, objectTraps)
  // `[storage]` used for `Array.isArray` on proxy work properly
    : Proxy.revocable<AbstractData>([store], arrayTraps)

  store.revoke = revoke
  store.proxy = proxy

  return proxy
}

export function wrapInProducerIfNot(value: AbstractData | EventProducer): EventProducer {
  if (isProducer(value))
    return value

  return wrapInProducer(value)
}
