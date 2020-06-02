import {
  filter,
  tap,
  share,
  map
} from 'rxjs/operators'
import { MonoTypeOperatorFunction, Observable } from 'rxjs'
import { debug } from '@/reactive/debug'
import {
  IProducerStore,
  EventReducersMap,
  ModelEvent,
  Producerable,
  ModelTypesToPayloadsMap,
  EventReducer,
  ModelEventPayload
} from '../types'
import { StateMemory } from '../memory'
import { receive, unsubscribeStore } from './receive'
import { isHaveEventInMemory } from '../events'
import { getStoreFromEvent } from './getters'
import { handleByReducer } from './reducers'
import { async, isPromiseLike } from './utils'
import { pushToParent } from '../bubbling'

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
      filter(event => !isHaveEventInMemory(event, memory)),
      debug('not have event in memory'),
      saveInMemory(memory),
      share()
    )

  store.subscription = store.stream.subscribe(event => {
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

    const eventDispatcher = event.payload.store.dispatcher

    // if it promise, then need push result,
    // to allow life hooks handle it
    result.then(isResolved => {
      console.log('[MEMORY] async event completed', event, store, isResolved)
      removeEventIfResolved(event, isResolved)

      eventDispatcher.success(event, store)
    },
    error => {
      // Will remove event even it was failed,
      // it allow not stuck in allways processing phase
      removeEventIfResolved(event, true)

      eventDispatcher.failure(event, store, error)
    })
  })
}

/** Remove event from store memory of target and all parents */
const removeEventIfResolved = (event: ModelEvent<ModelEventPayload<IProducerStore<any, any>>, any>, isResolved: boolean) => {
  // if result was false, then event wasn't hadled,
  // and he still wait processing
  // then it need store

  if (!isResolved)
    return

  // if result was true, then event was handled
  // and need remove it from all memories, which possible catched it
  const { payload: { store } } = event

  removeEventFromStoreAndParent(event, store)
}

function removeEventFromStoreAndParent(event: ModelEvent<ModelEventPayload<IProducerStore<any, any>>, any>, store: IProducerStore<any, any>) {
  if (store.memory)
    store.memory.remove(event)

  if (store.parent)
    removeEventFromStoreAndParent(event, store.parent.store)
}

const saveInMemory = <
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(memory: StateMemory<ModelEvent<any, any>>): MonoTypeOperatorFunction<ModelEvent<TP[keyof TP], keyof TP>> =>
    stream =>
      stream.pipe(
        tap(event => memory.push(event))
      )

