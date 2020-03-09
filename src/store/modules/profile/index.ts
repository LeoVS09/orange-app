import { ProfileState } from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  state: new ProfileState(),
  actions,
  mutations
}

export {
  ProfileState
}
