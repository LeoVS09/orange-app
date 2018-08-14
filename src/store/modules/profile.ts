// @ts-ignore
import * as actionTypes from '@/store/actionTypes'
import {Commit} from 'vuex'
import {User, ProfileState, IActionContext} from '../state'

const SET_PROFILE_DATA = 'SET_PROFILE_DATA'
const initState: ProfileState = {};

export default {
  state: initState,

  actions: {
    [actionTypes.SETUP_USER_PROFILE] (context: IActionContext<ProfileState>, user: User) {
      context.commit(SET_PROFILE_DATA, user)
    }
  },

  mutations: {
    [SET_PROFILE_DATA] (state: ProfileState, user: User) {
      state.data = user
    }
  }
}
