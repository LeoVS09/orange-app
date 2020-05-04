import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

export const debug = (msg: string) => <T>(source: Observable<T>): Observable<T> =>
  source.pipe(tap(x => console.debug('[Reactive]', msg, x)))

