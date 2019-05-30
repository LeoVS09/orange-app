import * as API from "@/api";
import * as queryTypes from '@/api/graphql/queries/types'
import {
   University,
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

export default {

   [actionTypes.SETUP_USER_PROFILE]({commit}: IActionContext<ProfileState>, user: UserProfile) {
      commit(mutations.SET_PROFILE_DATA, user)
   },

   async [actionTypes.INITIALISE_PROFILE_DATA]({commit}: IActionContext<ProfileState>) {
      // TODO
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

   // async [actionTypes.SEARCH_COUNTRIES]({commit}: IActionContext<ProfileState>, search: string): Promise<Array<Country>>  {
   //    const result = await API.searchCountries({search})
   //    if(!result){
   //       console.log('Cannot find countries', search)
   //       return []
   //    }
   //
   //    return result.nodes as Array<Country>
   // },

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

export function handleReadError(description: string, id?: string) {
   // TODO
   console.error(description)
}
