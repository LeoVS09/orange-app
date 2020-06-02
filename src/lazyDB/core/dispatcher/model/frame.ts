import { ModelEventDispatcher } from './base'
import { AsyncBeforeAnimationFrameDispatcher } from '../base/frame'
import { IProducerStore, ModelPropertyKey, ModelTypesToPayloadsMap } from '../../types'

/**
 * js have different behavior to "new Promise" and "Promise.resolve"
 * if you want to all event handlers and pipe will be executed before next frame
 * use this dispatch handler
 */
export class AsyncBeforeAnimationFrameModelEventDispatcher<
  Store extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey,
  TP extends ModelTypesToPayloadsMap<Store, Key> = ModelTypesToPayloadsMap<Store, Key>,
> extends ModelEventDispatcher<Store, Key, TP> {
  constructor() {
    super(new AsyncBeforeAnimationFrameDispatcher())
  }
}
