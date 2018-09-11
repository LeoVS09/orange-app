import * as actionTypes from '../actionTypes'
import {Commit} from 'vuex'
import {User, ProfileState, IActionContext} from '../../state'
import {signin, signout} from '../../identity';

const SET_PROFILE_DATA = 'SET_PROFILE_DATA';
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
          console.log("Signin result", result);
          if(!result){
            return Promise.reject(false)
          }
          context.commit(SET_PROFILE_DATA, result);
          return Promise.resolve(true)
        })
    },
    [actionTypes.LOGOUT_FROM_PROFILE] (context: IActionContext<ProfileState>){
      signout()
    }
  },

  mutations: {
    [SET_PROFILE_DATA] (state: ProfileState, user: User) {
      state.data = user
    }
  }
}
