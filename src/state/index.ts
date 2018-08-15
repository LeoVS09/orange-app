import {ActionContext} from 'vuex'

import { User, UserType }from "./user"
import {Team} from "./team";
import {Problem, ResultOfProblem, ResultOfTest} from "./problem";
import {Contest, Requirements} from "./contest";

export {
  User,
  UserType,
  Team,
  Problem,
  ResultOfProblem,
  ResultOfTest,
  Contest,
  Requirements
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
