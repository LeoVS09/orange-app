import { Subject } from 'rxjs'
import { IEventDispatcher, ModelEvent } from '@/lazyDB/core/types'

export class AtomicEventDispatcher<Payload> implements IEventDispatcher<Payload> {
   public eventsSubject = new Subject<ModelEvent<Payload | undefined>>()

   public dispatch(type: string, payload?: Payload, date?: number) {
     this.atomicDispatch(type, payload, date)
   }

   protected atomicDispatch(type: string, payload?: Payload, date = Date.now()) {
     this.eventsSubject.next({ type, payload, date })
   }
}
