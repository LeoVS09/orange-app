import { MonoTypeOperatorFunction } from 'rxjs'
import { filter } from 'rxjs/operators'
import { debug } from '@/reactive/debug'
import {
  ModelEvent,
  ModelEventPropertyPayload,
  ModelTypesToPayloadsMap
} from '../types'
import { StateMemory } from '../memory'
import { isEventsEqual } from '../events'

/**
 * Pre-optimisation step executed before some event will store in memory,
 * possible executed in redndering time,
 * so pre-optimisation must be ligth and fast
 * to not slow execution of first render,
 *
 * In main case just filter events which already remembered
 */
export const preOptimisation = <
TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(memory: StateMemory<ModelEvent<any, any>>): MonoTypeOperatorFunction<ModelEvent<TP[keyof TP], keyof TP>> =>
    stream => stream.pipe(
      filter(event => !isHaveEventInMemory(event, memory)),
      debug('PRE-OPTMISATION: not have event in memory')
    )

export const isHaveEventInMemory = <
    Event extends ModelEvent<ModelEventPropertyPayload<any, any>> = ModelEvent<ModelEventPropertyPayload<any, any>>
>(b: Event, memory: StateMemory<ModelEvent<any, any>>) =>
    memory!.some(a => isEventsEqual(a, b))

