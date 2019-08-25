import {IEventDispatcher, ModelEvent} from "@/lazyDB/core/types";
import {Subject} from "rxjs";

export class AtomicEventDispatcher<Payload> implements IEventDispatcher<Payload> {

   public eventsSubject = new Subject<ModelEvent<Payload | undefined>>()

   protected atomicDispatch(type: string, payload?: Payload, date = Date.now()) {
      this.eventsSubject.next({type, payload, date})
   }

   public dispatch(type: string, payload?: Payload, date?: number){
      this.atomicDispatch(type, payload, date)
   }
}