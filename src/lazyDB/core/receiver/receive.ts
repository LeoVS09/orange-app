import {
  IProducerStore,
  ModelEvent,
  ModelEventPayload,
  BaseEventsPayloads,
  Producerable,
  ModelTypesToPayloadsMap
} from '../types'

export const unsubscribeStore = <Store extends IProducerStore<any, any> = IProducerStore>(
  { subscription }: Store
) =>
    subscription && subscription.unsubscribe()

export interface Subscriber<TP extends ModelTypesToPayloadsMap<any, any>> {
  (event: ModelEvent<TP[keyof TP], keyof TP>): void
}

export const subscribeStore = <
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(
    store: IProducerStore<T, TP>,
    subscriber: Subscriber<TP>
  ) => {
  const { dispatcher } = store

  store.subscription = dispatcher.eventsSubject
    .subscribe(event => {
      try {

        return subscriber(event)

      } catch (error) {
        console.error('Was catched error from subscriber', subscriber, 'on event', event, '\n', error)
      }
    })
}

// TODO: create store class and
// write subscription method, with all of receive logic
export function receive<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(
  store: IProducerStore<T, TP>,
  subscriber: Subscriber<TP>
) {
  unsubscribeStore(store)

  subscribeStore(store, subscriber)
}
