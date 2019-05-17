import {ActionContext} from "vuex";
import {ProblemsState, ProfileState, UIState, Platform} from "./modules";
import {Country, FullProblem, PartialProblem, UserProfile} from "@/models";

export interface RootState {
   ui: UIState,
   profile: ProfileState,
   problems: ProblemsState
}

export interface RootGetters {
   platform: Platform,
   isSideBarVisible: boolean,
   isSignInPage: boolean,

   profile?: UserProfile
   isTeacher: boolean

   openProblems: Array<FullProblem>,
   closedProblems: Array<FullProblem>,
   problems: Array<FullProblem>,
   problemById: (id: string) => FullProblem | PartialProblem,

   allCountries: Array<Country>
}

export interface IActionContext<S> extends ActionContext<S, RootState> {
   rootGetters: RootGetters
}
