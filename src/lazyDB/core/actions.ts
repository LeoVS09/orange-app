import { EventReducersMap, PropertyEventType, ModelTypesToPayloadsMap } from './types'

// By some reason, typescript correctly understand each reducer type, but not allow it
// TODO: fix
export const changeTrackableReducersMap: EventReducersMap<any, ModelTypesToPayloadsMap<any, any>> = {

  // Not storage get events in memory
  [PropertyEventType.GetProperty]: (store, event) => true,

  // Store set events only when they change data
  [PropertyEventType.SetProperty]: (store, { payload: { oldValue, newValue } }) =>
    oldValue === newValue,

  // Store all delete events
  [PropertyEventType.DeleteProperty]: (store, event) =>
    false

}
