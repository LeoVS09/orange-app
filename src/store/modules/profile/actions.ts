import * as API from "@/api";
import {
   UserProfile
} from "@/models";
import {RegisterProfileData} from './types'
import * as mutations from './mutationTypes'
import * as actionTypes from './actionTypes'
import {checkIsLogin, currentUserIfHave, signin, signout, signup} from "@/authentication";
import {Country} from "@/models/country";
import {ProfileState} from './state'
import {IActionContext} from '@/store/state'

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export default {

   [actionTypes.SETUP_USER_PROFILE](context: IActionContext<ProfileState>, user: UserProfile) {
      context.commit(mutations.SET_PROFILE_DATA, user)
   },

   async [actionTypes.INITIALISE_PROFILE_DATA](context: IActionContext<ProfileState>){
      const countries = await API.countries()
      if(!countries || !countries.length)
         return console.error("Cannot load countries") // TODO: handle error

      context.commit(mutations.SET_COUNTRIES, countries as Array<Country>)
   },

   [actionTypes.LOGIN_TO_PROFILE](context: IActionContext<ProfileState>, {login, password, isRemember}: { login: string, password: string, isRemember: boolean }): Promise<boolean> {

      return signin(login, password, isRemember)
         .then(result => {

            if (!result) {
               return Promise.reject(false)
            }
            context.commit(mutations.SET_PROFILE_DATA, result);
            return Promise.resolve(true)
         })
   },

   [actionTypes.LOGOUT_FROM_PROFILE](context: IActionContext<ProfileState>) {
      signout();
      context.commit(mutations.LOGOUT_FROM_PROFILE);
   },

   [actionTypes.SEARCH_COUNTRIES](context: IActionContext<ProfileState>, name: string) {
      return API.searchCountries(name)
   },

   [actionTypes.REGISTER_PROFILE](context: IActionContext<ProfileState>, user: RegisterProfileData): Promise<boolean> {
      // TODO: add login
      return signup({
         username: user.username,
         email: user.email,
         password: user.password,
         name: user.username,
         firstName: user.firstName,
         middleName: user.middleName,
         lastName: user.lastName,
         avatarUrl: user.avatarUrl
      })
         .then(result => {

            if (!result) {
               return Promise.reject(false)
            }

            context.commit(mutations.SET_PROFILE_DATA, {...result, ...user});
            return Promise.resolve(true)
         })
   },
   async [actionTypes.INIT_PROFILE](context: IActionContext<ProfileState>) {
      console.log('App start, check is login')
      const checkResult = checkIsLogin();
      console.log('check is login result', checkResult)
      if (!checkResult.ok) {
         return;
      }

      const current = await currentUserIfHave()
      console.log('Current user result', current)
      if (!current.ok)
         return

      if (current.user.id !== checkResult.userId)
         return

      context.commit(mutations.SET_PROFILE_DATA, current.user);
      console.log("cookie", document.cookie);
   }
}
