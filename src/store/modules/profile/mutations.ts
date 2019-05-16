import * as mutationTypes from './mutationTypes'
import {
   UserProfile
} from "@/models";
import Vue from "vue";
import {Country} from "@/models/country";
import {ProfileState} from './state'

export default {
   [mutationTypes.SET_PROFILE_DATA](state: ProfileState, user: UserProfile) {
      Vue.set(state, 'data', user);
   },

   [mutationTypes.LOGOUT_FROM_PROFILE](state: ProfileState) {
      Vue.set(state, 'data', undefined);
   },

   [mutationTypes.SET_COUNTRIES](state: ProfileState, countries: Array<Country>){
      state.countries = countries
   }
}
