import { User }from "./user"
import {ActionContext} from 'vuex'

export {
  User
}
export interface RootState {
  ui: UIState,
  profile: ProfileState
}

export interface ProfileState {
  data?: User
}

export enum Platform {
  DESKTOP,
  TABLET,
  MOBILE
}

export interface UIState {
  currentPlatform: Platform,
  sideBarVisible: boolean
}

export interface RootGetters {
  platform: Platform,
  isSideBarVisible: boolean
}

export interface IActionContext<S> extends ActionContext<S,RootState> {
  rootGetters: RootGetters
}
