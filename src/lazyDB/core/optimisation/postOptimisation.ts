import { Observable, SchedulerLike } from 'rxjs'
import { filter, debounceTime } from 'rxjs/operators'
import {
  ModelEvent, PropertyEventType, isSetEvent, ModelEventSetPropertyPayload, IProducerStore
} from '../types'
import { zipSetEvents } from './zipper'
import { visitParents } from '../bubbling'

const WAIT_TIME_WHEN_TRY_ZIP = 100 // 0.1 second, probably enough for speed of user typing

export interface PostOptimisationOptions {
    waitTimeWhenTryZip?: number // ms
    scheduler?: SchedulerLike
}

/**
 * Will periodically zip set events into one
 */
export const postOptimisation = ({
  waitTimeWhenTryZip = WAIT_TIME_WHEN_TRY_ZIP,
  scheduler
}: PostOptimisationOptions = {}) =>
    <T>(source: Observable<ModelEvent<any, any>>): Observable<ModelEvent<any, any>> => {
    // need return same source,
    // because then events will be received
    // but post-optimisation probably need change or filter some events before
      source.pipe(
        filter(isSetEvent),
        debounceTime(waitTimeWhenTryZip, scheduler)
      )
        .subscribe(event => {
          const { payload: { store } } = event as ModelEvent<ModelEventSetPropertyPayload<IProducerStore, any>, any>

          // zip events in store and his parents
          visitParents(store, ({ memory }) => {
            if (memory)
              zipSetEvents(memory)
          })
        })

      return source

    }
