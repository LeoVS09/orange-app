import { Commit} from 'vuex'
import { ModelStatus} from '@/store/modules'
import { SET_STATUS, SET_MODEL_STATE, SET_READ_STATE} from './actionTypes'
import { ISetModelStatePayload, ISetReadStatePayload, ISetStatusPayload, ModelReadState, MODULE_PREFIX} from './types'
import { RootGetters} from '@/store/state'
import { GET_READ_STATE, GET_STATUS} from '@/store/modules/statuses/getters'

export const setStatus = (scope: string, commit: Commit, id: string, status: ModelStatus) => {
   const payload: ISetStatusPayload = {
      scope,
      id,
      status,
   }
   commit(`${MODULE_PREFIX}/${SET_STATUS}`, payload, { root: true})
}


export const setReadState = (scope: string, commit: Commit, id: string, read: ModelReadState) => {
   const payload: ISetReadStatePayload = {
      scope,
      id,
      read,
   }
   commit(`${MODULE_PREFIX}/${SET_READ_STATE}`, payload, { root: true})
}

export const setModelState = (scope: string, commit: Commit, id: string, status: ModelStatus, read: ModelReadState) => {
   const payload: ISetModelStatePayload = {
      scope,
      id,
      model: {
         status,
         read,
         changedAt: new Date(),
      },
   }
   commit(`${MODULE_PREFIX}/${SET_MODEL_STATE}`, payload, { root: true})
}

type ISetStatus = (id: string, status: ModelStatus) => void

type ISetReadState = (id: string, read: ModelReadState) => void

type ISetModelState = (id: string, status: ModelStatus, read: ModelReadState) => void

type IGetStatus = (id: string) => ModelStatus

type IGetRead = (id: string) => ModelReadState

export interface StatusManipulation {
   setStatus: ISetStatus
   setReadState: ISetReadState
   setModelState: ISetModelState
   getStatus: IGetStatus
   getRead: IGetRead
}

export const generateStatusManipulation = (scope: string, commit: Commit, rootGetters: RootGetters): StatusManipulation => ({
   setStatus: (id, status) => setStatus(scope, commit, id, status),
   setReadState: (id, read) => setReadState(scope, commit, id, read),
   setModelState: (id, status, read) => setModelState(scope, commit, id, status, read),
   getRead: (id) => rootGetters[GET_READ_STATE](scope, id),
   getStatus: (id) => rootGetters[GET_STATUS](scope, id),
})
