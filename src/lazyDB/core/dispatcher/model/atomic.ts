import { ModelEventDispatcher} from './base'
import { AtomicEventDispatcher} from '../base/atomic'

export class AtomicModelEventDispatcher extends ModelEventDispatcher {

   constructor() {
      super(new AtomicEventDispatcher())
   }
}
