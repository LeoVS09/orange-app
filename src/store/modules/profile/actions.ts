import * as API from "@/api";
import * as queryTypes from '@/api/graphql/queries/types'
import {
   UserProfile
} from "@/models";
import {IRegisterProfilePayload} from './types'
import * as mutations from './mutationTypes'
import * as actionTypes from './actionTypes'
import {checkIsLogin, currentUserIfHave, signin, signout, signup} from "@/authentication";
import {City, Country} from "@/models/country";
import {ProfileState} from './state'
import {IActionContext} from '@/store/state'
import * as fragmentsTypes from "@/api/graphql/fragments/types";

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export interface ILoginToProfilePayload {
   login: string,
   password: string,
   isRemember: boolean
}

function responseToCountry(result: fragmentsTypes.FullCountry): Country {
   return {
      ...result,
      cities: result.cities.nodes as Array<fragmentsTypes.FullCountry_cities_nodes>
   }
}

function responseToCity(result: fragmentsTypes.FullCity): City {
   return {
      ...result,
      universities: result.universities.nodes as Array<fragmentsTypes.FullCity_universities_nodes>
   }
}

export default {

   [actionTypes.SETUP_USER_PROFILE]({commit}: IActionContext<ProfileState>, user: UserProfile) {
      commit(mutations.SET_PROFILE_DATA, user)
   },

   async [actionTypes.INITIALISE_PROFILE_DATA]({commit}: IActionContext<ProfileState>) {
      // TODO
   },

   async [actionTypes.LOAD_ALL_COUNTRIES]({commit}: IActionContext<ProfileState>): Promise<boolean> {
      const countries = await API.countries({})
      if (!countries) {
         console.error("Cannot load countries") // TODO: handle error
         return false
      }

      commit(mutations.SET_COUNTRIES, countries.nodes as Array<Country>)
      return true
   },
   
   async [actionTypes.LOAD_ALL_CITIES]({commit}: IActionContext<ProfileState>): Promise<boolean> {
      const cities = await API.cities({})
      if(!cities){
         console.error('Cannot load cities')
         return false
      }
      
      commit(mutations.SET_COUNTRIES, cities.nodes as Array<City>)
      return true
   },
   
   async [actionTypes.LOAD_COUNTRY]({commit}: IActionContext<ProfileState>, id: string): Promise<Country | undefined> {
      const result = await API.country({id})
      if(!result){
         console.error('Cannot load country', id)
         return
      }
      
      const country = responseToCountry(result)
      commit(mutations.SET_COUNTRY, country)
      return country
   },

   async [actionTypes.LOAD_CITY]({commit}: IActionContext<ProfileState>, id: string): Promise<City | undefined> {
     const result = await API.city({id})
      if(!result){
         console.error('Cannot load city', id)
         return
      }

      const city = responseToCity(result)
      commit(mutations.SET_CITY, city)
      return city
   },

   async [actionTypes.LOGIN_TO_PROFILE]({commit}: IActionContext<ProfileState>, {login, password, isRemember}: ILoginToProfilePayload): Promise<boolean> {
      const result = await signin(login, password, isRemember)

      if (!result)
         return false

      commit(mutations.SET_PROFILE_DATA, result);
      return true
   },

   [actionTypes.LOGOUT_FROM_PROFILE]({commit}: IActionContext<ProfileState>) {
      signout();
      commit(mutations.LOGOUT_FROM_PROFILE);
   },

   async [actionTypes.SEARCH_COUNTRIES]({commit}: IActionContext<ProfileState>, search: string): Promise<Array<Country>>  {
      const result = await API.searchCountries({search})
      if(!result){
         console.log('Cannot find countries', search)
         return []
      }

      return result.nodes as Array<Country>
   },

   async [actionTypes.REGISTER_PROFILE]({commit}: IActionContext<ProfileState>, user: IRegisterProfilePayload): Promise<boolean> {
      // TODO: add login
      const result = await signup({
         username: user.username,
         email: user.email,
         password: user.password,
         name: user.username,
         firstName: user.firstName,
         middleName: user.middleName,
         lastName: user.lastName,
         avatarUrl: user.avatarUrl
      })
      if (!result)
         return false

      commit(mutations.SET_PROFILE_DATA, {...result, ...user});
      return true
   },
   async [actionTypes.INIT_PROFILE]({commit}: IActionContext<ProfileState>): Promise<boolean> {
      console.log('App start, check is login')
      const checkResult = checkIsLogin();
      console.log('check is login result', checkResult)
      if (!checkResult.ok) {
         return false
      }

      const current = await currentUserIfHave()
      if (!current.ok)
         return false

      if (current.user.id !== checkResult.userId)
         return false

      commit(mutations.SET_PROFILE_DATA, current.user);
      return true
   }
}
