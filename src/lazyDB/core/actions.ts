import { EventReducersMap, EventType } from './types'

export const changeTrackableReducersMap: EventReducersMap = {

   [EventType.GetProperty]: (store, event) =>
      // Not storage get events in memory
      true,

   [EventType.SetProperty]: (store, { oldValue, newValue}) =>
      // Store set events only when they change data
      oldValue === newValue,

   [EventType.DeleteProperty]: (store, event) =>
      // Store all delete events
      false,
}
