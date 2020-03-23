import { AtomicEventDispatcher } from './atomic'

export class AsyncEventDispatcher<Payload> extends AtomicEventDispatcher<Payload> {
  public dispatch(type: string, payload?: Payload, date = Date.now()) {
    return new Promise(resolve => {
      this.atomicDispatch(type, payload, date)
      resolve()
    })
  }
}
