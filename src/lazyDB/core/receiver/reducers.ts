import {
  IProducerStore,
  EventReducersMap,
  ModelEvent,
  EventReducer,
  AtomicEventReducersMap,
  Producerable,
  ModelTypesToPayloadsMap,
  ModelEventPayload
} from '../types'
import { receive } from './receive'
import { isPromiseLike } from './utils'
import { generateControl } from './control'

export function atomicReceiveByReducers<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<IProducerStore<T>>
>(
  store: IProducerStore<T, TP>,
  reducers: AtomicEventReducersMap<IProducerStore<T, TP>, TP>
) {
  receive(store, event => {
    const reducer = reducers[event.type]
    if (!reducer)
      return

    handleByReducer(store, event, reducer as any)
  })
}

export function asyncReceiveByReducers<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any>
>(
  store: IProducerStore<T, TP>,
  reducers: EventReducersMap<IProducerStore<T, TP>, TP>
) {
  receive(store, async event => {
    const reducer = reducers[event.type]
    if (!reducer)
      return

    handleByReducer<IProducerStore<T, TP>, TP[keyof TP]>(store, event, reducer as any)
  })
}

export function handleByReducer<
  Store extends IProducerStore<any, any> = IProducerStore,
  Payload extends ModelEventPayload<Store> = ModelEventPayload<Store>,
>(
  store: Store,
  event: ModelEvent<Payload, any>,
  reducer: EventReducer<Store, Payload>
): boolean | PromiseLike<boolean> {
  try {
    const control = generateControl(event.payload.store)

    const result = reducer(store, event, control)

    if (isPromiseLike(result)) {
      return result
        .then(promiseResult => !!promiseResult)
    }

    return !!result

  } catch (error) {
    console.error('Was catched error from reducer', reducer, 'on event', event, '\n', error)
    return false
  }
}
