import { Observable, MonoTypeOperatorFunction } from 'rxjs'
import { tap } from 'rxjs/operators'

export const debug = <T>(msg: string): MonoTypeOperatorFunction<T> => source =>
  source.pipe(tap(x => console.debug('[Reactive]', msg, x)))

