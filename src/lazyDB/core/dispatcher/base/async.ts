import { AtomicEventDispatcher } from './atomic'
import { TypesToPayloadsMap } from '../../types'

export class AsyncEventDispatcher<TP extends TypesToPayloadsMap<any> = TypesToPayloadsMap> extends AtomicEventDispatcher<TP> {
  public dispatch<Type extends keyof TP>(type: Type, payload: TP[Type], date = Date.now()) {
    return new Promise(resolve => {
      this.atomicDispatch(type, payload, date)
      resolve()
    })
  }
}
