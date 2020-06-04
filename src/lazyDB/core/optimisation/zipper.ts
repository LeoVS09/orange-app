import { ModelEvent, ModelEventSetPropertyPayload, isSetEvent } from '../types'
import { StateMemory } from '../memory'

type SetEvent = ModelEvent<ModelEventSetPropertyPayload<any, any>, any>

export interface SetEventsByProperty {
    [prop: string]: Array<SetEvent>
}

/**
 * Will zip all sequental set events into a single
 * @param memory - memory which will updated
 */
export const zipSetEvents = (memory: StateMemory<ModelEvent<any, any>>) => {
  const setEvents = memory.filter(isSetEvent) as Array<SetEvent>
  // if events less than 2
  // then events cannot be zipped
  if (setEvents.length < 1)
    return

  const splitedEvents = setEvents
    // Will sort events sequentially by time,
    .sort(byTime)
    // split by property which they change
    .reduce(appendSetEventsToPropertyCategory, {} as SetEventsByProperty)

  // hold only categories which have at least 2 events
  const zippableEvents = Object.values(splitedEvents).filter(events => events.length > 0)

  for (const [first, ...rest] of zippableEvents) {
    // will think first event already collapsed, just for start
    let colapsed = first

    for (const nextEvent of rest) {
      // if events cannot be colapsed, then other next events cannot be too
      if (!isSetEventsCanBeCollapsed(colapsed, nextEvent))
        break

      colapsed = colapseSetEvents(colapsed, nextEvent)
      memory.remove(nextEvent)
    }

    // replace first event, to not break order of other events
    // all colapsed events already removed
    memory.replace(first, colapsed)
  }

}

/** Sort events sequentially by time when they was created */
export const byTime = <T>(a: ModelEvent<T, any>, b: ModelEvent<T, any>): number =>
  a.date - b.date

/**
 * Will split set events by property
 * @return Object where key is property name and value is array of set events related to this property
 * */
export const appendSetEventsToPropertyCategory = <T>(map: SetEventsByProperty, event: SetEvent): SetEventsByProperty => {
  const prop = event.payload.name
  if (!map[prop])
    map[prop] = []

  map[prop].push(event)

  return map
}

/**
 * If two sequental set events can be collased into one will return true,
 * for more info check `colapseSetEvents`
 * */
export function isSetEventsCanBeCollapsed({ payload: prev, date: prevDate }: SetEvent, { payload: next, date: nextDate }: SetEvent): boolean {
  // need check name to be sure when collapsing used not in `zipSetEvents`
  if (prev.name !== next.name)
    return false

  // if next event was early then previous
  if (prevDate > nextDate)
    return false

  // if new event not change value which was set by previus
  if (prev.newValue !== next.oldValue)
    return false

  return true
}

/**
 * Will zip two events into new one, like new event
 * example: a: {oldValue: 'a', newValue: 'ab'}, b: {oldValue: 'ab', newValue: 'abc'} -> produce {oldValue: 'a', newValue: 'abc'}
 * as date will be used date of first event
 * */
export const colapseSetEvents = (a: SetEvent, b: SetEvent): SetEvent => ({
  type: a.type,
  date: a.date,
  payload: {
    store: a.payload.store,
    name: a.payload.name,
    type: a.payload.type,
    oldValue: a.payload.oldValue,
    newValue: b.payload.newValue
  }
})
