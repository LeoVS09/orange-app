import { ProblemsState } from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state: new ProblemsState(),
  actions,
  mutations
}

export {
  ProblemsState
}
