import Vue from 'vue'
import {
  UserProfile
} from '@/models'
import * as mutationTypes from './mutationTypes'
import { ProfileState } from './state'

export default {
  [mutationTypes.SET_PROFILE_DATA](state: ProfileState, user: UserProfile) {
    Vue.set(state, 'data', user)
  },

  [mutationTypes.LOGOUT_FROM_PROFILE](state: ProfileState) {
    Vue.set(state, 'data', undefined)
  }
}
