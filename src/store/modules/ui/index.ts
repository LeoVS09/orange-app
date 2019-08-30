import { UIState, Platform} from './state'
import actions from './actions'
import mutations from './mutations'

export default {
   state: new UIState(),
   actions,
   mutations,
}

export {
   UIState,
   Platform,
}
