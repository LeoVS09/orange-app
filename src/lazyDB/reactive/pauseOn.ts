import { Observable } from 'rxjs'

/**
 * Pause when emited true, and resume when false
 *
 * Standart case of usage
 * ---a---b---c----d--e-------------> - input events
 * -------------t-------f-----------> - pause events
 * ---a---b---c---------d-e---------> - result events stream
 *
 * When spawned read event, get events on pause,
 * and then on success they retrive execution
 */
export const pauseOn = (pause: Observable<boolean>) => <T>(source : Observable<T>) => {
  let canSpawn = true
  const lastSpawnedEvents: Array<T> = []

  return new Observable<T>(observer => {
    pause.subscribe(isPause => {
      canSpawn = !isPause

      if (isPause || !lastSpawnedEvents.length)
        return

      // when pause end emit events which was on pause
      lastSpawnedEvents.splice(0)
        .forEach(event => observer.next(event))
    })

    return source.subscribe({
      next(event) {
        // on pause remember last event
        if (!canSpawn) {
          lastSpawnedEvents.push(event)
          return
        }

        observer.next(event)
      },
      error(err) { observer.error(err) },
      complete() { observer.complete() }
    })
  })
}

