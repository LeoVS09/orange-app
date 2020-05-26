import { AsyncModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/async'
import { ProducerStore } from '@/lazyDB/core/Store'
import { isProducer } from '@/lazyDB/core/common'
import { arrayTraps, objectTraps } from '@/lazyDB/core/hooks/traps'
import {
  Producerable,
  EventProducer,
  IModelEventDispatcher,
  ModelTypesToPayloadsMap,
  IProducerStore,
  ModelPropertyKey
} from './types'

// Typescript totaly not support current dynamic behaivor,
// but use all of this hack inside only one file is much better
// than write totaly uncheckable code

export const defaultDispatcher = <
  Dispatcher extends IModelEventDispatcher<IProducerStore<any, any>, any, any>
>(): Dispatcher =>
  new AsyncModelEventDispatcher() as unknown as Dispatcher

export function wrapInProducer<
  T extends Producerable<any> = Producerable,
  Dispatcher extends IModelEventDispatcher<IProducerStore<T>> = IModelEventDispatcher<IProducerStore<T>>
>(
  base: T = { } as T,
  dispatcher: Dispatcher = defaultDispatcher<Dispatcher>()
): EventProducer<T> {
  const store = new ProducerStore({
    base,
    dispatcher
  })

  const { proxy, revoke } = !Array.isArray(base)
    ? Proxy.revocable<IProducerStore<T>>(store, objectTraps as unknown as ProxyHandler<IProducerStore<T>>)
  // `[storage]` used for `Array.isArray` on proxy work properly
    : Proxy.revocable<IProducerStore<T>>([store] as unknown as IProducerStore<T>, arrayTraps as unknown as ProxyHandler<IProducerStore<T>>)

  store.revoke = revoke
  store.proxy = proxy as unknown as EventProducer<T>

  return proxy as unknown as EventProducer<T>
}

export function wrapInProducerIfNot<T extends Producerable = Producerable>(value: T | EventProducer<T>): EventProducer<T> {
  if (isProducer(value))
    return value

  return wrapInProducer(value)
}
