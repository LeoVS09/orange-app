import * as actionTypes from '../actionTypes'
import Vue from 'vue'
import {Commit} from 'vuex'
import {User, ProfileState, IActionContext} from '../../state'
import {signin, signout, checkIsLogin, currentUserIfHave, signup} from '../../authentication';
import * as API from '../../api';

const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
const LOGOUT_FROM_PROFILE = 'LOGOUT_FROM_PROFILE';


const initState: ProfileState = {};

export interface RegisterProfileData {
   firstName: string,
   middleName?: string,
   lastName: string,
   email: string,
   username: string,
   password: string,
   avatarUrl?: string
}

export default {
   state: initState,

   actions: {

      [actionTypes.SETUP_USER_PROFILE](context: IActionContext<ProfileState>, user: User) {
         context.commit(SET_PROFILE_DATA, user)
      },

      [actionTypes.LOGIN_TO_PROFILE](context: IActionContext<ProfileState>, {login, password, isRemember}: { login: string, password: string, isRemember: boolean }): Promise<boolean> {

         return signin(login, password, isRemember)
            .then(result => {

               if (!result) {
                  return Promise.reject(false)
               }
               context.commit(SET_PROFILE_DATA, result);
               return Promise.resolve(true)
            })
      },

      [actionTypes.LOGOUT_FROM_PROFILE](context: IActionContext<ProfileState>) {
         signout();
         context.commit(LOGOUT_FROM_PROFILE);
      },

      [actionTypes.SEARCH_COUNTRIES](context: IActionContext<ProfileState>, name: string) {
         // return API.searchCountries(name)
         return API.countries()
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

               context.commit(SET_PROFILE_DATA, {...result, ...user});
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

         context.commit(SET_PROFILE_DATA, current.user);
         console.log("cookie", document.cookie);
      }
   },

   mutations: {
      [SET_PROFILE_DATA](state: ProfileState, user: User) {
         Vue.set(state, 'data', user);
      },

      [LOGOUT_FROM_PROFILE](state: ProfileState) {
         Vue.set(state, 'data', undefined);
      }
   }
}
