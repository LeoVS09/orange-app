import { AtomicEventDispatcher } from './atomic'
import { TypesToPayloadsMap } from '../../types'

/**
 * js have different behavior to "new Promise" and "Promise.resolve"
 * if you want to all event handlers and pipes will be executed before next frame
 * use this dispatcher
 * */
export class AsyncBeforeAnimationFrameDispatcher<TP extends TypesToPayloadsMap<any> = TypesToPayloadsMap> extends AtomicEventDispatcher<TP> {
  public dispatch<Type extends keyof TP>(type: Type, payload: TP[Type], date = Date.now()) {
    return Promise.resolve((resolve: () => void) => {
      this.atomicDispatch(type, payload, date)
      resolve()
    })
  }
}
