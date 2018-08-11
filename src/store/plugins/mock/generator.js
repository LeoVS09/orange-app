import * as actionTypes from '../../actionTypes'

import staticUserData from './user.json'

// const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

export default function createDataGeneratorPlugin () {
  return store => {
    store.dispatch(actionTypes.SETUP_USER_PROFILE, Object.assign({}, staticUserData))
  }
}
