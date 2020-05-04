import { Observable, SchedulerLike } from 'rxjs'
import {
  filter,
  map,
  debounceTime
} from 'rxjs/operators'
import { StateMemory } from '../core/memory'
import { ModelEvent } from '../core/types'
import { ModelEventTypes, ModelEventReadPayload } from '../database/events'
import { isReading } from '../database/states'
import { pauseWhileReading } from './pauseWhileReading'
import { debug } from '../../reactive/debug'

const WAIT_TIME_WHEN_GETS_STOP_SPAWN = 50

export interface SpawnReadOptions {
  memory: StateMemory<ModelEvent<any>>,
  canRead?: () => boolean,
  waitTimeWhenGetsStopSpawn?: number // ms
  scheduler?: SchedulerLike
}

/**
 * Spawn read events when gets event stops spawning,
 * pause when reading in process
 * then spawn read event again
 * @param memory - model state memory
 * @param canRead - pause if cannot read
 * @param waitTimeWhenGetsStopSpawn - wait when get events stop spawning
 * @param scheduler - rxjs scheduler for testing
 * @returns {Observable} - read event payload
 */
export const spawnRead = (
  {
    memory,
    canRead = () => true,
    waitTimeWhenGetsStopSpawn = WAIT_TIME_WHEN_GETS_STOP_SPAWN,
    scheduler
  }: SpawnReadOptions
) =>
    <T>(source: Observable<ModelEvent<any>>): Observable<ModelEventReadPayload> =>
    source.pipe(
      // TODO: fix reading hook
      // add test to isReading getter
      // add test to read success and failure
      // on read success and failure remove read event
      // add to read success and failure link to read event
      pauseWhileReading(() => isReading(memory) || !canRead()),
      // Wait some time to be sure, get events stop spawn
      debug('before debounce'),
      debounceTime(waitTimeWhenGetsStopSpawn, scheduler),
      debug('after debounce'),
      // need retrive all GET events from memory after debounce
      // and check they still exists
      // in case they was removed while debounce
      map(() => allGetEventsFromMemory(memory)),
      filter(events => !!events.length),

      map(wrapGetEventsToReadPayload),
      debug('get events spawn read event')
    )

const allGetEventsFromMemory = (memory: StateMemory<ModelEvent<any>>) =>
  memory.filter(({ type }) => type === ModelEventTypes.GetProperty)

const wrapGetEventsToReadPayload = (gets: Array<ModelEvent<any>>): ModelEventReadPayload => {
  const { payload: { store } } = gets[0]
  const { readSchema } = store

  return {
    gets,
    sets: [],
    readSchema: readSchema!,
    store
  }
}
