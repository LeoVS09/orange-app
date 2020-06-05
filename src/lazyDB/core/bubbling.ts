import {
  IProducerStore,
  ModelEvent,
  ModelEventPayload,
  Producerable,
  BaseEventsPayloads,
  ModelPropertyKey
} from './types'
import { receive } from './receiver'

/** Setup event bubbling from child store to parent */
export function setupEventBubbling<
  ChildStore extends IProducerStore<any, any> = IProducerStore,
  ParentStore extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey
>(child: ChildStore, parent: ParentStore, prop: Key) {
  setAsParent(child, parent, prop)

  receive(child, event =>
    pushToParent(child, event)
  )
}

/** Set parent of store */
export function setAsParent<
  ChildStore extends IProducerStore<any, any> = IProducerStore,
  ParentStore extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey
>(child: ChildStore, parent: ParentStore, prop: Key) {
  child.parent = {
    store: parent,
    name: prop
  }
}

/** Try push to store parent, if store have parent */
export function pushToParent<ChildStore extends IProducerStore<any, any> = IProducerStore, Event extends ModelEvent<any, any> = ModelEvent>(
  store: ChildStore,
  event: Event
) {
  const { parent } = store
  if (!parent) {
    console.error('[Bubbling] event bubbling was set, but store don\'t have parent link', store, event)
    throw new Error('[Bubbling] event bubbling was set, but store don\'t have parent link')
  }

  const { store: { dispatcher } } = parent

  dispatcher.eventsSubject.next(event)
}

/** Apply funcion to current store and all of his parents */
export function visitParents<Store extends IProducerStore<any, any>>(start: Store, visitor: (store: Store) => void) {
  visitor(start)

  const { parent } = start
  if (!parent)
    return

  visitParents(parent.store, visitor)
}
