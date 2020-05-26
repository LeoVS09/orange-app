import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { ModelEvent } from '../core/types'

export const debugPayload = <T>(
  message: string,
  extruder: (payload: T) => any = payload => payload
) => (stream: Observable<ModelEvent<T>>) =>
    stream.pipe(tap(({ payload }) => {
      const extrudedMessage = extruder(payload)
      console.debug(message, extrudedMessage)
    }))
