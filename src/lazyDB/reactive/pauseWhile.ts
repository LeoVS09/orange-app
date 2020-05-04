import { Observable } from 'rxjs'

/**
 * Pause while predicate return true, and resume when false
 *
 * @param predicate: (event) => boolean - is events on pause
 *
 * @example Standart case of usage
 * ---a---b---c----d--e----c---------> - input events
 * ---f---f---f----t--t----f---------> - predicate returns
 * ------------------------(dec)-----> - result stream
 *
 * While on pause will buffer events and then spawn them
 */

export const pauseWhile = <T>(predicate: (event: T) => boolean) => (source: Observable<T>) => {
  const buffer: Array<T> = []

  return new Observable<T>(observer => source.subscribe({
    next(event) {
      // on pause buffer events
      if (predicate(event)) {
        buffer.push(event)
        return
      }

      // if was on pause flush buffer
      if (buffer.length) {
        buffer
          .splice(0)
          .forEach(x => observer.next(x))
      }

      observer.next(event)
    },
    error(err) { observer.error(err) },
    complete() { observer.complete() }
  }))
}
