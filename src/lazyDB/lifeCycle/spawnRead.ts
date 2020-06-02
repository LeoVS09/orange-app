import { Observable, SchedulerLike } from 'rxjs'
import {
  filter,
  map,
  debounceTime
} from 'rxjs/operators'
import { StateMemory } from '../core/memory'
import { ModelEvent, ModelEventGetPropertyPayload } from '../core/types'
import { ModelEventTypes, ModelEventReadPayload } from '../database/events'
import { isReading, isHaveReadingError } from '../database/states'
import { pauseWhileReading } from './pauseWhileReading'
import { debug } from '../../reactive/debug'
import { debugPayload } from './utils'
import { IDatabaseModelProducerStore } from '../database/types'

const WAIT_TIME_WHEN_GETS_STOP_SPAWN = 50

export interface SpawnReadOptions {
  canRead?: () => boolean,
  waitTimeWhenGetsStopSpawn?: number // ms
  scheduler?: SchedulerLike
}

// FIXME: still spawn read when have reading errors

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
export const spawnRead = <Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>(
  store: Store,
  {
    canRead = () => true,
    waitTimeWhenGetsStopSpawn = WAIT_TIME_WHEN_GETS_STOP_SPAWN,
    scheduler
  }: SpawnReadOptions = {}) =>
    <T>(source: Observable<ModelEvent<any, any>>): Observable<ModelEventReadPayload> =>
      source.pipe(
        // TODO: fix reading hook
        // add test to isReading getter
        // add test to read success and failure
        // on read success and failure remove read event
        // add to read success and failure link to read event
        debugPayload<ModelEventGetPropertyPayload>('[SpawnRead] received get', ({ name }) => name),
        pauseWhileReading(() => isReading(store.memory!) || !canRead()),
        // Wait some time to be sure, get events stop spawn
        debounceTime(waitTimeWhenGetsStopSpawn, scheduler),
        // debugInitialPayload('[SpawnRead] get after debounce', ({ name }: ModelEventGetPropertyPayload) => name),
        // need retrive all GET events from memory after debounce
        // and check they still exists
        // in case they was removed while debounce
        map(() => allGetEventsFromMemory(store.memory!)),
        filter(events => !!events.length),

        map(wrapGetEventsToReadPayload(store)),
        debug('get events spawn read event')
      )

const allGetEventsFromMemory = (memory: StateMemory<ModelEvent<any>>) =>
  memory.filter(({ type }) => type === ModelEventTypes.GetProperty)

const wrapGetEventsToReadPayload = <Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>(store: Store) =>
  (gets: Array<ModelEvent<any>>): ModelEventReadPayload => ({
    gets,
    sets: [],
    store
  })
