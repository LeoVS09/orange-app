import { wrapInProducer } from '../wrap'
import { AtomicModelEventDispatcher } from '../dispatcher/model/atomic'
import { getStore, isProducer } from '../common'
import {
  Producerable,
  IProducerStore,
  EventProducer,
  ProducerStoreSetter,
  PropertyEventType,
  ModelEvent,
  ModelEventSetPropertyPayload,
  ModelEventGetPropertyPayload,
  isDate
} from '../types'
import { receive, Subscriber } from './receive'
import { removeEventFromMemory } from './memory'
import { StateMemory } from '../memory'
import { getAbsolutePath } from '../aos'

/** Generate control object, which can be used, to update source object */
export function generateControl<
  T extends Producerable<any> = Producerable,
  Store extends IProducerStore<T, any> = IProducerStore
>(store: Store): EventProducer<T> {
  const { base } = store

  const result = wrapInProducer<T>(base, new AtomicModelEventDispatcher() as any)

  const controlStore = getStore(result)!

  // add hooks for not break real object bubling tree and hook aplly
  controlStore.getter = store.getter
  controlStore.setter = genSetter(store.setter)

  const { memory } = store
  if (!memory) {
    console.warn('Memory was not found in control handler', store)
    return result
  }

  const rootPath = getAbsolutePath(store)

  // will resolve events from front object model, based on set events
  receive(controlStore, handleControlEvent(rootPath, memory))

  return result
}

export type Setter = ProducerStoreSetter<IProducerStore<any, any>>

/**
 * Generate setter for control,
 * which use target producer setter to apply hooks defined on real model
 * */
const genSetter = (baseSetter: Setter): Setter => (store, prop, value) => {

  if (isProducer(value)) {
    console.error('Try assign producer to control, it can produce incorrect behavior', store, prop, value)
    throw new Error('Try assong proucer to control')
  }

  return baseSetter(store, prop, value)
}

const handleControlEvent = (rootPath: string, memory: StateMemory<ModelEvent>): Subscriber<any> =>
  event => {
    switch (event.type) {
      case PropertyEventType.SetProperty: {
        handelSetEvent(rootPath, memory, event)
        break
      }
      default:
        // other events not have impact
        // but possible need handle delete events,
        // or add posiblity to control user events
        break
    }
  }

const eventTypesWhichCanBeResovled = [PropertyEventType.GetProperty, PropertyEventType.SetProperty] as Array<any>

/**
 * Handel set event under control,
 * and resolve all get and set events into real model, which was linked to properties
 * @param rootPath - properties path for root node,
 *  as example for database mode it will be "table-name.some-id",
 *  will be used as start for resolving events inside memory
 * @param memory - memory of root node, which events will be resolved
 * @param event - received set event on control model
 */
export function handelSetEvent(
  rootPath: string,
  memory: StateMemory<ModelEvent<any>>,
  { payload: { name, newValue } }: ModelEvent<ModelEventSetPropertyPayload>
) {
  // pathes of all properties which resolved
  const resolvedProperties: Array<string> = [`${name}`]

  if (isDataObject(newValue)) {
    // will be setted as linked entity,
    // need understand which proerties it actually resolve
    resolvedProperties.push(...(getPropertyPathes(newValue).map(prop => `${name}.${prop}`)))
  }

  // abosult pathes to root object
  const absoluteResolvedProperties = resolvedProperties.map(prop => `${rootPath}.${prop}`)

  const eventsToRemove = memory.memory
    .filter(event => eventTypesWhichCanBeResovled.includes(event.type))
    .filter(({ payload: event }: ModelEvent<ModelEventSetPropertyPayload | ModelEventGetPropertyPayload>) => {
      // abosult property path name
      const property = `${getAbsolutePath(event.store)}.${event.name}`

      // Need compare event property names by path,
      // because event can be received from inner entity,
      // but on assign to control, we have only new object

      if (absoluteResolvedProperties.includes(property))
        // if was get event, then get event resolved (read compled)
        // if was set event, then set event resolved (update completed)
        return true

      return false
    })

  console.log('[Control] events to remove', eventsToRemove, 'on event from control', name, newValue)

  eventsToRemove
    .forEach(removeEventFromMemory)

}

/** Return true if object can be iterated to receive valueble properties */
const isDataObject = (value: any): boolean =>
  value
  && typeof value === 'object'
  && !isDate(value)

const getObjectKeys = (obj: {[key: string]: any}): Array<string> => {
  const keys = Object.keys(obj)

  if (Array.isArray(obj) && keys.length > 1)
    // if object array, with multiple items
    // not need iterate over all properties
    // in most of cases initial get event was generated from trap under index '0'
    // and only one first item properties will be enough
    // but WARN: possible will not resolve `get` events if they produced not first item
    return ['0']

  return keys
}

/**
 * Recursivly generate pathes to all properties in object
 */
function getPropertyPathes(obj: {[key: string]: any}): Array<string> {
  const keys = getObjectKeys(obj)

  const properties = [...keys]

  for (const key of keys) {
    const value = obj[key]
    if (!isDataObject(value))
      continue

    properties.push(...(
      getPropertyPathes(value)
        .map(property => `${key}.${property}`)
    ))
  }

  return properties
}
