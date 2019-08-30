import { AsyncModelEventDispatcher} from '@/lazyDB/core/dispatcher/model/async'
import {
   AbstractData, EventProducer,
   IEventDispatcher,
   IModelEventDispatcher,
   IProducerStore,
   ModelEvent,
   ModelEventPayload,
} from '@/lazyDB/core/types'
import { ModelEventTypes, ReadFailureEventPayload, ReadSuccessEventPayload} from '@/lazyDB/database/events'
import { Subject} from 'rxjs'
import { IDatabaseProducerStore} from '@/lazyDB/database/types'
import { getStore} from '@/lazyDB/core/common'

export const readSuccessEventPayload =
   (data: AbstractData, store: IDatabaseProducerStore): ReadSuccessEventPayload => ({
      data,
      store,
   })

export const readFailureEventPayload =
   <T extends Error = any>(error: T, store: IDatabaseProducerStore): ReadFailureEventPayload<T> => ({
      error,
      store,
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

   public readSuccess = (data: AbstractData, store: IDatabaseProducerStore) =>
      this.dispatch(ModelEventTypes.ReadSuccess, readSuccessEventPayload(data, store))

   public readFailure = (error: Error, store: IDatabaseProducerStore) =>
      this.dispatch(ModelEventTypes.ReadFailure, readFailureEventPayload(error, store))
}

export function isDatabaseDispatcher(value: any): value is DatabaseDispatcher {
   if (typeof value !== 'object')
      return false

   if (
      !value.eventsSubject ||
      !value.dispatch ||
      !value.get ||
      !value.set ||
      !value.delete ||
      !value.readSuccess ||
      !value.readFailure
   )
      return false

   return true
}

export function wrapToDatabaseDispatcher(store: IProducerStore) {
   if(isDatabaseDispatcher(store.dispatcher))
      return

   store.dispatcher = new DatabaseDispatcher(store.dispatcher)
}

export function getDatabaseStore(model: AbstractData | EventProducer): IDatabaseProducerStore {
   const store = getStore(model)

   wrapToDatabaseDispatcher(store)

   return store as IDatabaseProducerStore
}
