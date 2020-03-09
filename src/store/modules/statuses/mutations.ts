import * as mutationTypes from './mutationTypes'
import { StatusState } from './state'
import {
  ISetModelStatePayload,
  ISetReadStatePayload,
  ISetStatusPayload,
  ModelReadState,
  ModelState,
  ModelStatus
} from './types'

function defaultModelState(): ModelState {
  return {
    status: ModelStatus.None,
    read: ModelReadState.None,
    changedAt: new Date()
  }
}

export default {
  [mutationTypes.SET_STATUS](state: StatusState, { scope, id, status }: ISetStatusPayload) {
    const modelState = getModelStateOrCreate(state, scope, id)

    modelState.status = status
    modelState.changedAt = new Date()
  },
  [mutationTypes.SET_READ_STATE](state: StatusState, { scope, id, read }: ISetReadStatePayload) {
    const modelState = getModelStateOrCreate(state, scope, id)

    modelState.read = read
    modelState.status = ModelStatus.Synced
    modelState.changedAt = new Date()
  },
  [mutationTypes.SET_MODEL_STATE](state: StatusState, { scope, id, model }: ISetModelStatePayload) {
    const modelState = getModelStateOrCreate(state, scope, id)

    modelState.status = model.status
    modelState.read = model.read
    modelState.changedAt = new Date()
  }
}

function getModelStateOrCreate(state: StatusState, scope: string, id: string) {
  if (!state.scopes[scope])
    state.scopes[scope] = { }

  const scopeData = state.scopes[scope]

  if (!scopeData[id])
    scopeData[id] = defaultModelState()

  return scopeData[id]
}
