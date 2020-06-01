import { Subject } from 'rxjs'
import {
  PropertyEventType,
  IEventDispatcher,
  IModelEventDispatcher,
  ModelEvent,
  ModelEventPayload,
  IProducerStore,
  BaseEventsPayloads,
  ModelEventGetPropertyPayload,
  Producerable,
  TypesToPayloadsMap,
  ModelPropertyKey,
  ModelTypesToPayloadsMap
} from '@/lazyDB/core/types'
import {
  getEventPayload, setEventPayload, successEventPayload, failureEventPayload
} from '@/lazyDB/core/common'
import { AosFieldType } from '@/abstractObjectSchema'

export class ModelEventDispatcher<
  Store extends IProducerStore<any, any> = IProducerStore,
  Key extends ModelPropertyKey = ModelPropertyKey,
  TP extends ModelTypesToPayloadsMap<Store, Key> = ModelTypesToPayloadsMap<Store, Key>,
> implements IModelEventDispatcher<Store, Key, TP> {
   public eventsSubject: Subject<ModelEvent<TP[keyof TP], keyof TP>>

   public dispatch: <Type extends keyof TP>(type: Type, payload: TP[Type], date?: number) => any

   protected dispatcher: IEventDispatcher<TP>

   constructor(dispatcher: IEventDispatcher<TP>) {
     this.dispatcher = dispatcher
     this.eventsSubject = dispatcher.eventsSubject
     this.dispatch = (...args) => this.dispatcher.dispatch(...args)
   }

   public getPropertyType(name: Key, store: Store): AosFieldType {
     return AosFieldType.Any
   }

   public get(name: Key, store: Store) {
     const type = this.getPropertyType(name, store)
     const payload = getEventPayload(name, store, type)
     this.dispatch(PropertyEventType.GetProperty, payload)
   }

   public set<V>(name: Key, oldValue: V, newValue: V, store: Store) {
     const type = this.getPropertyType(name, store)
     const payload = setEventPayload(name, oldValue, newValue, store, type)
     this.dispatch(PropertyEventType.SetProperty, payload)
   }

   public delete(name: Key, store: Store) {
     const type = this.getPropertyType(name, store)
     const payload = getEventPayload(name, store, type)
     this.dispatch(PropertyEventType.DeleteProperty, payload)
   }

   public success(event: ModelEvent<any>, store: Store) {
     const payload = successEventPayload(event, store)
     this.dispatch(PropertyEventType.Success, payload)
   }

   public failure(event: ModelEvent<any>, store: Store, error?: any) {
     const payload = failureEventPayload(event, store, error)
     this.dispatch(PropertyEventType.Failure, payload)
   }
}
