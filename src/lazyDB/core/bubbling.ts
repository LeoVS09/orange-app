import {
  IProducerStore,
  ModelEvent,
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

/** Return iterator over givent store and all of his parents */
export function* parents<Store extends IProducerStore<any, any>>(store: Store): Generator<Store> {
  yield store

  if (!store.parent)
    return

  yield* parents(store.parent.store)
}

/** Apply funcion to current store and all of his parents */
export const visitParents = <Store extends IProducerStore<any, any>>(
  start: Store,
  visitor: (store: Store) => void
) => {
  for (const store of parents(start))
    visitor(store)
}

/**
 * Apply funcion to current store and all of his parents,
 * and return true if visitor return true at least once.
 * Will stop execution on first true
 *  */
export function isSomeParent<Store extends IProducerStore<any, any>>(
  start: Store,
  predicate: (store: Store) => boolean
): boolean {
  for (const store of parents(start)) {
    if (predicate(store))
      return true
  }

  return false
}
