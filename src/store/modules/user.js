import * as actionTypes from '@/store/actionTypes'

const SET_PROFILE_DATA = 'SET_PROFILE_DATA'

export default {
  state: {
    data: {
      firstName: '',
      login: ''
    }
  },

  actions: {
    [actionTypes.SETUP_USER_PROFILE] ({ commit, rootGetters }, user) {
      commit(SET_PROFILE_DATA, user)
    }
  },

  mutations: {
    [SET_PROFILE_DATA] (state, user) {
      state.data = user
    }
  }
}
