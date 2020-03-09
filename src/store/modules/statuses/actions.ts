import { IActionContext } from '@/store/state'
import { ISetModelStatePayload, ISetReadStatePayload, ISetStatusPayload } from '@/store/modules/statuses/types'
import * as actionTypes from './actionTypes'
import * as mutations from './mutationTypes'
import { StatusState } from './state'

const DEBUG = process.env.NODE_ENV !== 'production'

export default {

  [actionTypes.SET_STATUS]({ commit }: IActionContext<StatusState>, payload: ISetStatusPayload) {
    if (DEBUG)
      console.log('Set status', payload)

    commit(mutations.SET_STATUS, payload)
  },

  [actionTypes.SET_READ_STATE]({ commit }: IActionContext<StatusState>, payload: ISetReadStatePayload) {
    if (DEBUG)
      console.log('Set read state', payload)

    commit(mutations.SET_READ_STATE, payload)
  },

  [actionTypes.SET_MODEL_STATE]({ commit }: IActionContext<StatusState>, payload: ISetModelStatePayload) {
    if (DEBUG)
      console.log('Set model state', payload)

    commit(mutations.SET_MODEL_STATE, payload)
  }
}
