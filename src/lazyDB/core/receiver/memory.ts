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
  EventReducer
} from '../types'
import { StateMemory } from '../memory'
import { receive, unsubscribeStore } from './receive'
import { isHaveEventInMemory } from '../events'
import { getStoreFromEvent } from './getters'
import { handleByReducer } from './reducers'
import { async } from './utils'
import { pushToParent } from '../bubbling'

export function receiveWithMemoryAndReducers<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(
  store: IProducerStore<T, TP>,
  reducers: EventReducersMap<IProducerStore<T, TP>, TP>,
  subscriber: (event: EventWithReducer<T, TP, ModelEvent<TP[keyof TP], keyof TP>>) => void
) {
  unsubscribeStore(store)

  const memory = new StateMemory<ModelEvent<TP[keyof TP], keyof TP>>()
  const { dispatcher } = store

  store.memory = memory

  // Trying handle event by reducers in storage
  // If event handled (handler return true) and storage have memory
  // event would remove from storage memory
  store.stream = dispatcher.eventsSubject
    .pipe(
      filter(event => !isHaveEventInMemory(event, memory)),
      debug('not have event in memory'),
      saveInMemory(memory),
      share()
    )

  const withReducers = store.stream.pipe(
    pickReducer(reducers),
    // possible need save event after push to parent
    pushToParentIfNotHaveReducer(store)
  )

  store.subscription = withReducers.subscribe(subscriber)
}

export interface EventWithPossibleReducer<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>,
  Event = ModelEvent<TP[keyof TP], keyof TP>
> {
  event: Event
  reducer?: EventReducer<IProducerStore<T, TP>, TP[keyof TP]>
 }

export interface EventWithReducer<
 T extends Producerable<any> = Producerable,
 TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>,
 Event = ModelEvent<TP[keyof TP], keyof TP>
> {
 event: Event
 reducer: EventReducer<IProducerStore<T, TP>, TP[keyof TP]>
}

const pickReducer = <
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>,
  Event extends ModelEvent<TP[keyof TP], keyof TP> = ModelEvent<TP[keyof TP], keyof TP>
>(reducers: EventReducersMap<IProducerStore<T, TP>, TP>) =>
    (stream: Observable<Event>): Observable<EventWithPossibleReducer<T, TP, Event>> =>
  stream.pipe(map(event => ({
    event,
    reducer: reducers[event.type]
  }))) as Observable<EventWithPossibleReducer<T, TP, Event>>

const pushToParentIfNotHaveReducer = <
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>,
  Event extends ModelEvent<TP[keyof TP], keyof TP> = ModelEvent<TP[keyof TP], keyof TP>
>(store: IProducerStore<T, TP>) =>
    (stream: Observable<EventWithPossibleReducer<T, TP, Event>>): Observable<EventWithReducer<T, TP, Event>> =>
      stream.pipe(
        filter(({ event, reducer }) => {
          if (reducer)
            return true

          pushToParent(store, event)
          return false
        })
      ) as Observable<EventWithReducer<T, TP, Event>>

// TODO: refactor, async code same like atomic,
// need write more complex rxjs streams
export function atomicReceiveWithMemory<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(
  store: IProducerStore<T, TP>,
  reducers: EventReducersMap<IProducerStore<T, TP>, TP>
) {
  receiveWithMemoryAndReducers(store, reducers, ({ event, reducer }) => {
    const isResolved = handleByReducer(store, event, reducer as any)

    if (!isResolved || !store.memory)
      return

    store.memory.remove(event)
  })
}

export function asyncReceiveWithMemory<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(
  store: IProducerStore<T, TP>,
  reducers: EventReducersMap<IProducerStore<T, TP>, TP>
) {
  receiveWithMemoryAndReducers(store, reducers, async ({ event, reducer }) => {
    const handlerResult = handleByReducer(store, event, reducer as any)
    const isResolved = await async(handlerResult)

    if (!isResolved || !store.memory)
      return

    store.memory.remove(event)
  })
}

const saveInMemory = <
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any, any>
>(memory: StateMemory<ModelEvent<any, any>>): MonoTypeOperatorFunction<ModelEvent<TP[keyof TP], keyof TP>> =>
    stream =>
      stream.pipe(
        tap(event => memory.push(event))
      )

