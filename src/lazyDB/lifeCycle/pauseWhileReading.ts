import { Observable } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { ModelEventTypes } from '../database/events'
import { ModelEvent } from '../core/types'
import { pauseOn } from '../reactive/pauseOn'
import { filterEventsByTypes } from '../reactive/filterEventByTypes'
import { pauseWhile } from '../reactive/pauseWhile'

const eventsWhichCanChangeState = [
  ModelEventTypes.GetProperty,
  // Read events used as triger to flush buffer with get events
  ModelEventTypes.ReadSuccess,
  ModelEventTypes.ReadFailure
]

export const pauseWhileReading = (isReading: () => boolean) => <T>(source: Observable<ModelEvent<T>>) =>
  source.pipe(
    filterEventsByTypes(eventsWhichCanChangeState),
    pauseWhile(isReading),
    filterEventsByTypes([ModelEventTypes.GetProperty])
  )
