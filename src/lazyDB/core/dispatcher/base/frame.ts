// js have different behavior to "new Promise" and "Promise.resolve"
// if you want to all event handlers and pipes will be executed before next frame
// use this dispatcher
import {AtomicEventDispatcher} from "./atomic";

export class AsyncBeforeAnimationFrameDispatcher<Payload> extends AtomicEventDispatcher<Payload> {

   public dispatch(type: string, payload?: Payload, date = Date.now()) {
      return Promise.resolve((resolve: () => void) => {
         this.atomicDispatch(type, payload, date)
         resolve()
      })
   }
}
