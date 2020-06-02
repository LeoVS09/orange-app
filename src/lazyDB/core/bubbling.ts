import {
  IProducerStore,
  ModelEvent,
  ModelEventPayload,
  Producerable,
  BaseEventsPayloads,
  ModelPropertyKey
} from './types'
import { receive } from './receiver'
import { toNumberIfCan } from '../database/aos/utils'

/**
 * Setup event bubbling from child store to parent
 */
export function setupEventBubbling<
  ChildStore extends IProducerStore<any, any> = IProducerStore,
  ParentStore extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey
>(
  child: ChildStore,
  parent: ParentStore,
  prop: Key
) {
  child.parent = {
    store: parent,
    name: prop
  }

  receive(child, event => {
    if (typeof toNumberIfCan(prop) === 'number' || prop === 'nodes')
      console.debug('[Bubbling] push from array to parent', prop, event)
    pushToParent(child, event)
  })
}

/**
 * Try push to store parent, if store have parent
 */
export function pushToParent<ChildStore extends IProducerStore<any, any> = IProducerStore, Event extends ModelEvent<any, any> = ModelEvent>(
  store: ChildStore,
  event: Event
) {
  const { parent } = store
  if (!parent) {
    debugger
    console.error('[Bubbling] event bubbling was set, but store don\'t have parent link', store, event)
    throw new Error('[Bubbling] event bubbling was set, but store don\'t have parent link')
  }

  const { store: { dispatcher } } = parent

  dispatcher.eventsSubject.next(event)
}
