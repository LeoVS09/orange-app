import { Subject } from 'rxjs'
import { IEventDispatcher, ModelEvent, TypesToPayloadsMap } from '@/lazyDB/core/types'

export class AtomicEventDispatcher<TP extends TypesToPayloadsMap<any> = TypesToPayloadsMap> implements IEventDispatcher<TP> {
   public eventsSubject = new Subject<ModelEvent<TP[keyof TP], keyof TP>>()

   public dispatch<Type extends keyof TP>(type: Type, payload: TP[Type], date?: number) {
     this.atomicDispatch(type, payload, date)
   }

   protected atomicDispatch<Type extends keyof TP>(type: Type, payload: TP[Type], date = Date.now()) {
     this.eventsSubject.next({ type, payload, date })
   }
}
