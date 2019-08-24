import {
   EventType,
   IEventDispatcher,
   IModelEventDispatcher,
   ModelEvent,
   ModelEventPayload,
   IProducerStore
} from "@/lazyDB/core/types";
import {Subject} from "rxjs";
import {getEventPayload, setEventPayload} from "@/lazyDB/core/common";

export class ModelEventDispatcher implements IModelEventDispatcher<ModelEventPayload> {

   protected dispatcher: IEventDispatcher<ModelEventPayload>
   public eventsSubject: Subject<ModelEvent<ModelEventPayload | undefined>>
   public dispatch: (type: string, payload?: ModelEventPayload, date?: number) => any

   constructor(dispatcher: IEventDispatcher<ModelEventPayload>) {
      this.dispatcher = dispatcher
      this.eventsSubject = dispatcher.eventsSubject
      this.dispatch = this.dispatcher.dispatch
   }

   public get = (name: PropertyKey, store: IProducerStore) =>
      this.dispatch(EventType.GetProperty, getEventPayload(name, store))

   public set = (name: PropertyKey, oldValue: any, newValue: any, store: IProducerStore) =>
      this.dispatch(EventType.SetProperty, setEventPayload(name, oldValue, newValue, store))

   public delete = (name: PropertyKey, store: IProducerStore) =>
      this.dispatch(EventType.DeleteProperty, getEventPayload(name, store))
}
