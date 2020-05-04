import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'
import { ModelEventTypes } from '../database/events'
import { ModelEvent } from '../core/types'

export const filterEventsByTypes = (types: Array<ModelEventTypes>) =>
<T>(source: Observable<ModelEvent<T>>): Observable<ModelEvent<T>> =>
    source.pipe(filter(
      ({ type }) => types.includes(type as ModelEventTypes)
    ))
