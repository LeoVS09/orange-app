import { Subject } from 'rxjs'
import { AsyncModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/async'
import {
  AbstractData, EventProducer,
  IEventDispatcher,
  IModelEventDispatcher,
  IProducerStore,
  ModelEvent,
  ModelEventPayload
} from '@/lazyDB/core/types'
import {
  ModelEventTypes, ReadFailureEventPayload, ReadSuccessEventPayload, ReadEventPayload
} from '@/lazyDB/database/events'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { getStore } from '@/lazyDB/core/common'

export const readSuccessEventPayload = (
  data: AbstractData,
  readPayload: ReadEventPayload,
  store: IDatabaseModelProducerStore
): ReadSuccessEventPayload => ({
  readPayload,
  data,
  store
})

export const readFailureEventPayload = <T extends Error = any>(
  error: T,
  readPayload: ReadEventPayload,
  store: IDatabaseModelProducerStore
): ReadFailureEventPayload<T> => ({
    readPayload,
    error,
    store
  })

export class DatabaseDispatcher implements IModelEventDispatcher<ModelEventPayload> {
   public eventsSubject: Subject<ModelEvent<ModelEventPayload | undefined>>

   public dispatch: (type: string, payload?: ModelEventPayload, date?: number) => any

   public get: (name: PropertyKey, store: IProducerStore) => void

   public set: (name: PropertyKey, oldValue: any, newValue: any, store: IProducerStore) => void

   public delete: (name: PropertyKey, store: IProducerStore) => void

   protected dispatcher: IModelEventDispatcher<ModelEventPayload>

   constructor(dispatcher: IModelEventDispatcher<ModelEventPayload>) {
     this.dispatcher = dispatcher
     this.eventsSubject = dispatcher.eventsSubject
     this.dispatch = (...args) => this.dispatcher.dispatch(...args)

     this.get = (...args) => this.dispatcher.get(...args)
     this.set = (...args) => this.dispatcher.set(...args)
     this.delete = (...args) => this.dispatcher.delete(...args)
   }

   public readSuccess = (data: AbstractData, readPayload: ReadEventPayload, store: IDatabaseModelProducerStore) =>
     this.dispatch(ModelEventTypes.ReadSuccess, readSuccessEventPayload(data, readPayload, store))

   public readFailure = (error: Error, readPayload: ReadEventPayload, store: IDatabaseModelProducerStore) =>
     this.dispatch(ModelEventTypes.ReadFailure, readFailureEventPayload(error, readPayload, store))
}

export function isDatabaseDispatcher(value: any): value is DatabaseDispatcher {
  if (typeof value !== 'object')
    return false

  if (
    !value.eventsSubject
      || !value.dispatch
      || !value.get
      || !value.set
      || !value.delete
      || !value.readSuccess
      || !value.readFailure
  )
    return false

  return true
}

export function wrapToDatabaseDispatcher(store: IProducerStore) {
  if (isDatabaseDispatcher(store.dispatcher))
    return

  store.dispatcher = new DatabaseDispatcher(store.dispatcher)
}

export function getDatabaseStore(model: AbstractData | EventProducer): IDatabaseModelProducerStore {
  const store = getStore(model)
  if (!store) {
    console.error('[DatabaseDispatcher] getDatabaseStore cannot fund store', model)
    throw new Error('DatabaseDispatcher cannot find store')
  }

  wrapToDatabaseDispatcher(store)

  return store as IDatabaseModelProducerStore
}
