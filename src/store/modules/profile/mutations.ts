import * as mutationTypes from './mutationTypes'
import {
   UserProfile
} from "@/models";
import Vue from "vue";
import {City, Country} from "@/models/country";
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
   },

   [mutationTypes.SET_CITIES](state: ProfileState, cities: Array<City>) {
      state.cities = cities
   },

   [mutationTypes.SET_COUNTRY](state: ProfileState, country: Country) {
      const index = state.countries.findIndex(c => c.id === country.id)
      if(index === -1)
         state.countries.push(country)

      Vue.set(state.countries, index, country)
   },

   [mutationTypes.SET_CITY](state: ProfileState, city: City) {
      const index = state.cities.findIndex(c => c.id === city.id)
      if(index === -1)
         state.cities.push(city)

      Vue.set(state.cities, index, city)
   }
}
