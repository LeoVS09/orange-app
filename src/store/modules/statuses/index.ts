import { StatusState } from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  namespaced: true,
  state: new StatusState(),
  actions,
  getters,
  mutations,
}

export {
  StatusState,
}

export {
  StatusScope,
  StatusScopes,
  ModelStatus,
  ISetStatusPayload,
} from './types'
