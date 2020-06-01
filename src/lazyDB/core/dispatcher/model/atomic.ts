import { ModelEventDispatcher } from './base'
import { AtomicEventDispatcher } from '../base/atomic'
import { IProducerStore, ModelPropertyKey, ModelTypesToPayloadsMap } from '../../types'

export class AtomicModelEventDispatcher<
  Store extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey,
  TP extends ModelTypesToPayloadsMap<Store, Key> = ModelTypesToPayloadsMap<Store, Key>,
> extends ModelEventDispatcher<Store, Key, TP> {
  constructor() {
    super(new AtomicEventDispatcher())
  }
}
