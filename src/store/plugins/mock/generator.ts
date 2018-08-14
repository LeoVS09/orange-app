import * as actionTypes from '../../actionTypes'
import * as Vuex from 'vuex'
import staticUserData from './user.json'

// const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

export default function createDataGeneratorPlugin <S>() {
  return (store: Vuex.Store<S>) => {
    store.dispatch(actionTypes.SETUP_USER_PROFILE, Object.assign({}, staticUserData))
  }
}
