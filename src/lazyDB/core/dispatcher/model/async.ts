import { AsyncEventDispatcher } from '../base/async'
import { ModelEventDispatcher } from './base'
import { IProducerStore, ModelPropertyKey, ModelTypesToPayloadsMap } from '../../types'

export class AsyncModelEventDispatcher<
  Store extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey,
  TP extends ModelTypesToPayloadsMap<Store, Key> = ModelTypesToPayloadsMap<Store, Key>,
> extends ModelEventDispatcher<Store, Key, TP> {
  constructor() {
    super(new AsyncEventDispatcher())
  }
}
