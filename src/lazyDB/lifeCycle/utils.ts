import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ModelEventInnerPayload, ModelEvent } from '../core/types'
import { getInitialPayload } from '../database/connected/actions/database/types'

export const debugInitialPayload = <T>(
  message: string,
  extruder: (payload: T) => any = payload => payload
) => (stream: Observable<ModelEvent<ModelEventInnerPayload<T>>>) =>
    stream.pipe(tap(({ payload }) => {
      const realPayload = getInitialPayload(payload)
      const extrudedMessage = extruder(realPayload)
      console.debug(message, extrudedMessage)
    }))
