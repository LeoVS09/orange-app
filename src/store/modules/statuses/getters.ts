import { GetterTree } from 'vuex'
import { StatusState } from './state'
import { ModelStatus, ModelReadState, MODULE_PREFIX } from './types'

export const GET_STATUS = 'statuses/status'
export const GET_READ_STATE = 'statuses/read'

const getters: GetterTree<StatusState, any> = {

  status: state => (scope: string, id: string) => {
    const result = state.scopes[scope] && state.scopes[scope][id]
    if (!result)
      return ModelStatus.None

    return result.status
  },

  read: state => (scope: string, id: string) => {
    const result = state.scopes[scope] && state.scopes[scope][id]
    if (!result)
      return ModelReadState.None

    return result.read
  }
}

export default getters
