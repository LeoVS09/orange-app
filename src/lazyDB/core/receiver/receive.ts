import { IProducerStore, ModelEvent, ModelEventPayload } from '../types'

export const unsubscribeStore = ({ subscription }: IProducerStore) => subscription && subscription.unsubscribe()

export interface ISubscriber {
  (event: ModelEvent<ModelEventPayload | undefined>): void | Promise<void>
}

export const subscribeStore = (store: IProducerStore, subscriber: ISubscriber) => {
  const { dispatcher } = store

  store.subscription = dispatcher.eventsSubject
    .subscribe(subscriber)
}

export function receive(
  store: IProducerStore,
  subscriber: ISubscriber
) {
  unsubscribeStore(store)

  subscribeStore(store, subscriber)
}
