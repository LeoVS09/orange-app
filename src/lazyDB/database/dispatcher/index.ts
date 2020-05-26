import { Subject } from 'rxjs'
import { AsyncModelEventDispatcher } from '@/lazyDB/core/dispatcher/model/async'
import {
  Producerable, EventProducer,
  IEventDispatcher,
  IModelEventDispatcher,
  IProducerStore,
  ModelEvent,
  ModelEventPayload,
  BaseEventsPayloads,
  ModelPropertyKey,
  ModelTypesToPayloadsMap
} from '@/lazyDB/core/types'
import {
  ModelEventTypes, ReadFailureEventPayload, ReadSuccessEventPayload, ModelEventReadPayload, DatabaseModelTypesToPayloadsMap
} from '@/lazyDB/database/events'
import { IDatabaseModelProducerStore } from '@/lazyDB/database/types'
import { getStore } from '@/lazyDB/core/common'
import { AosEntitySchema, AosFieldType, isSimpleType } from '@/abstractObjectSchema'
import { GetFieldType } from '../base/repository/controls'

export const readSuccessEventPayload = <Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>(
  data: Producerable,
  readPayload: ModelEventReadPayload<Store>,
  store: Store
): ReadSuccessEventPayload<Store> => ({
    readPayload,
    data,
    store
  })

export const readFailureEventPayload = <
  Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore,
  T extends Error = any
>(
    error: T,
    readPayload: ModelEventReadPayload<Store>,
    store: Store
  ): ReadFailureEventPayload<Store, T> => ({
    readPayload,
    error,
    store
  })

export type DatabaseEventsPayloads = BaseEventsPayloads & ModelEventReadPayload & ReadSuccessEventPayload & ReadFailureEventPayload

export class DatabaseDispatcher<
  Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey,
  TP extends DatabaseModelTypesToPayloadsMap<Store, Key> = DatabaseModelTypesToPayloadsMap<Store, Key>,
> implements IModelEventDispatcher<Store, Key, TP> {
   public eventsSubject: Subject<ModelEvent<TP[keyof TP], keyof TP>>

   public dispatch: <Type extends keyof TP>(type: Type, payload: TP[Type], date?: number) => any

   public get: (prop: Key, store: Store) => void

   public set: <V>(prop: Key, oldValue: V, newValue: V, store: Store) => void

   public delete: (prop: Key, store: Store) => void

   protected dispatcher: IModelEventDispatcher<Store, Key, TP>

   constructor(dispatcher: IModelEventDispatcher<Store, Key, TP>) {
     this.dispatcher = dispatcher
     this.eventsSubject = dispatcher.eventsSubject

     this.dispatch = (...args) => this.dispatcher.dispatch(...args)

     // Need call exactly from this, to allow update DatabaseDispatcher GetPropertyType
     this.dispatcher.getPropertyType = (...args) => this.getPropertyType(...args)

     this.get = (...args) => this.dispatcher.get(...args)
     this.set = (...args) => this.dispatcher.set(...args)
     this.delete = (...args) => this.dispatcher.delete(...args)
   }

   public getPropertyType(name: Key, store: Store): AosFieldType {
     return AosFieldType.Any
   }

   public readSuccess = (data: Store['base'], readPayload: ModelEventReadPayload<Store>, store: Store) => {
     const payload = readSuccessEventPayload<Store>(data, readPayload, store)
     this.dispatch(ModelEventTypes.ReadSuccess, payload)
   }

   public readFailure = (error: Error, readPayload: ModelEventReadPayload<Store>, store: Store) => {
     const payload = readFailureEventPayload<Store>(error, readPayload, store)
     this.dispatch(ModelEventTypes.ReadFailure, payload)
   }
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

export function wrapToDatabaseDispatcher(store: IProducerStore<any, any>) {
  const { dispatcher } = store
  if (isDatabaseDispatcher(dispatcher))
    return

  store.dispatcher = new DatabaseDispatcher(dispatcher)
}

export function switchStoreToDatabaseStore<T extends Producerable<any> = any>(
  model: T | EventProducer<T>
): IDatabaseModelProducerStore<T, any> {
  const store = getStore(model)
  if (!store) {
    console.error('[DatabaseDispatcher] getDatabaseStore cannot fund store', model)
    throw new Error('DatabaseDispatcher cannot find store')
  }

  wrapToDatabaseDispatcher(store)

  return store as IDatabaseModelProducerStore<T, any>
}
