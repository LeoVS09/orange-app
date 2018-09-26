import {ActionContext} from 'vuex'

import { User, UserType }from "./user"
import {Team} from "./team";
import {
  Problem,
  ResultOfProblem,
  ResultOfTest,
  ResultRunProgram,
  Test,
  defaultProblem} from "./problem";
import {Contest, Requirements} from "./contest";
import problems from "../store/modules/problems";

export {
  User,
  UserType,
  Team,
  Problem,
  ResultOfProblem,
  ResultOfTest,
  Contest,
  Requirements,
  ResultRunProgram,
  Test,
  defaultProblem
}

export enum Platform {
  DESKTOP,
  TABLET,
  MOBILE
}

export interface RootState {
  ui: UIState,
  profile: ProfileState,
  problems: ProblemsState
}

export interface ProfileState {
  data?: User
}

export interface UIState {
  currentPlatform: Platform,
  sideBarVisible: boolean,
  isTextPage: boolean,
  isSignInPage: boolean
}

export interface ProblemsState {
  data: Array<Problem>,
  currentProblemId?: string
}

export interface RootGetters {
  platform: Platform,
  isSideBarVisible: boolean,
  isTextPage: boolean,
  openProblems: Array<Problem>,
  closedProblems: Array<Problem>,
  problems: Array<Problem>,
  currentProblem?: Problem
}

export interface IActionContext<S> extends ActionContext<S,RootState> {
  rootGetters: RootGetters
}
