import { tap, share } from 'rxjs/operators'
import { MonoTypeOperatorFunction } from 'rxjs'
import {
  IProducerStore,
  EventReducersMap,
  ModelEvent,
  Producerable,
  ModelTypesToPayloadsMap,
  ModelEventPayload
} from '../types'
import { StateMemory } from '../memory'
import { unsubscribeStore } from './receive'
import { handleByReducer } from './reducers'
import { isPromiseLike } from './utils'
import { pushToParent, visitParents, isSomeParent } from '../bubbling'
import { preOptimisation } from '../optimisation/pre'
import { postOptimisation } from '../optimisation/post'

// Trying handle event by reducers in storage
// If event handled (handler return true) and storage have memory
// event would remove from storage memory
export function receiveWithMemoryAndReducers<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(
  store: IProducerStore<T, TP>,
  reducers: EventReducersMap<IProducerStore<T, TP>, TP>
) {
  unsubscribeStore(store)

  const memory = new StateMemory<ModelEvent<TP[keyof TP], keyof TP>>()
  const { dispatcher } = store

  store.memory = memory

  // Save event in memory and
  // and then allow anyone handle it
  store.stream = dispatcher.eventsSubject
    .pipe(
      // Pre-optmisation just filter events which not need store
      // in main case they already remembored
      preOptimisation(memory),
      // if event not exists then remember
      saveInMemory(memory),
      // after that step on event can be executed other handlers
      // share allow any count of pipes to be added
      share()
    )

  store.subscription = store.stream
  // Post optimisation in main case will just zip all events which can
    .pipe(postOptimisation())
    .subscribe(event => {
      const reducer = reducers[event.type]
      if (!reducer) {
        pushToParent(store, event)
        return
      }

      const result = handleByReducer(store, event, reducer as any)

      if (!isPromiseLike(result)) {
        removeEventIfResolved(event, result)
        return
      }

      const eventStore = event.payload.store
      const eventDispatcher = eventStore.dispatcher

      // if it promise, then need push result,
      // to allow life hooks handle it
      result.then(isResolved => {
        console.log('[MEMORY] async event completed', event, store, isResolved)
        removeEventIfResolved(event, isResolved)

        eventDispatcher.success(event, eventStore)
      },
      error => {
      // Will remove event even it was failed,
      // it allow not stuck in allways processing phase
        removeEventIfResolved(event, true)

        eventDispatcher.failure(event, eventStore, error)
      })
    })
}

/** Remove event from store memory of target and all parents */
const removeEventIfResolved = (event: ModelEvent<ModelEventPayload<IProducerStore<any, any>>, any>, isResolved: boolean) => {
  if (!isResolved)
    // if result was false, then event wasn't hadled,
    // and still wait processing
    // then it need store in memory
    return

  // if result was true, then event was handled
  // and need remove it from all memories, which possible catched it
  removeEventFromMemory(event)
}

/** Will return true, if event exists in at least one event in memory */
export const existsInMemory = (event: ModelEvent<ModelEventPayload<IProducerStore<any, any>>, any>): boolean =>
  isSomeParent(event.payload.store, ({ memory }) => {
    if (!memory)
      return false

    return memory.includes(event)
  })

/** Will remove event from producer memeory, and all of his parents */
export const removeEventFromMemory = (event: ModelEvent<ModelEventPayload<IProducerStore<any, any>>, any>) =>
  // remove event from store and his parents
  visitParents(event.payload.store, ({ memory }) => {
    if (memory)
      memory.remove(event)
  })

const saveInMemory = <
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(memory: StateMemory<ModelEvent<any, any>>): MonoTypeOperatorFunction<ModelEvent<TP[keyof TP], keyof TP>> =>
    stream =>
      stream.pipe(
        tap(event => memory.push(event))
      )

