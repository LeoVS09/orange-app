import * as actionTypes from '../actionTypes'
import Vue from 'vue'
import {Commit} from 'vuex'
import {User, ProfileState, IActionContext} from '../../state'
import {signin, signout, checkIsLogin} from '../../identity';
import * as API from '../../api';
import {INIT_PROFILE} from "../actionTypes";

const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
const LOGOUT_FROM_PROFILE = 'LOGOUT_FROM_PROFILE';


const initState: ProfileState = {};

export default {
  state: initState,

  actions: {
    [actionTypes.SETUP_USER_PROFILE] (context: IActionContext<ProfileState>, user: User) {
      context.commit(SET_PROFILE_DATA, user)
    },
    [actionTypes.LOGIN_TO_PROFILE] (context: IActionContext<ProfileState>, {login, password, isRemember}: {login: string, password: string, isRemember: boolean}): Promise<boolean>{
      console.log("Sign in with login:", login, "and password:", password, ",remember:", isRemember);
      return signin(login, password, isRemember)
        .then(result => {

          if(!result){
            return Promise.reject(false)
          }
          context.commit(SET_PROFILE_DATA, result);
          return Promise.resolve(true)
        })
    },
    [actionTypes.LOGOUT_FROM_PROFILE] (context: IActionContext<ProfileState>){
      signout();
      context.commit(LOGOUT_FROM_PROFILE);
    },
    [actionTypes.REGISTER_PROFILE] (context: IActionContext<ProfileState>, user: {firstName: string, lastName: string, email: string, password: string}): Promise<boolean> {
      return signin(user.email, user.password, false)
        .then(result => {

          if(!result){
            return Promise.reject(false)
          }

          context.commit(SET_PROFILE_DATA, {...result, ...user});
          return Promise.resolve(true)
        })
    },
    [actionTypes.INIT_PROFILE] (context: IActionContext<ProfileState>) {
      const checkResult = checkIsLogin();

      if(!checkResult.ok) {
        return;
      }

      const user = checkResult.user;
      context.commit(SET_PROFILE_DATA, user);

      API.getUser(user.id)
        .then(result => {
          if(!result.ok) {
            console.error("Unexpected situation when try fetch profile");
            return;
          }

          context.commit(SET_PROFILE_DATA, result.user);
        })
    }
  },

  mutations: {
    [SET_PROFILE_DATA] (state: ProfileState, user: User) {
      Vue.set(state,'data', user);
    },

    [LOGOUT_FROM_PROFILE] (state: ProfileState) {
      Vue.set(state,'data', undefined);
    }
  }
}
