import {
   EventType,
   IEventDispatcher,
   IModelEventDispatcher,
   ModelEvent,
   ModelEventPayload,
   IProducerStore,
} from '@/lazyDB/core/types'
import {Subject} from 'rxjs'
import {getEventPayload, setEventPayload} from '@/lazyDB/core/common'

export class ModelEventDispatcher implements IModelEventDispatcher<ModelEventPayload> {
   public eventsSubject: Subject<ModelEvent<ModelEventPayload | undefined>>
   public dispatch: (type: string, payload?: ModelEventPayload, date?: number) => any

   protected dispatcher: IEventDispatcher<ModelEventPayload>

   constructor(dispatcher: IEventDispatcher<ModelEventPayload>) {
      this.dispatcher = dispatcher
      this.eventsSubject = dispatcher.eventsSubject
      this.dispatch = (...args) => this.dispatcher.dispatch(...args)
   }

   public get = (name: PropertyKey, store: IProducerStore) =>
      this.dispatch(EventType.GetProperty, getEventPayload(name, store))

   public set = (name: PropertyKey, oldValue: any, newValue: any, store: IProducerStore) =>
      this.dispatch(EventType.SetProperty, setEventPayload(name, oldValue, newValue, store))

   public delete = (name: PropertyKey, store: IProducerStore) =>
      this.dispatch(EventType.DeleteProperty, getEventPayload(name, store))
}
