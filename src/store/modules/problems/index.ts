import {ProblemsState} from './state'
import actions from './actions'
import mutations from './mutations'

export default {
   state: new ProblemsState(),
   actions,
   mutations
}

export {
   ProblemsState
}
