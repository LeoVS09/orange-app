import {ActionContext} from "vuex";
import {ProblemsState, ProfileState, UIState, Platform} from "./modules";
import {FullProblem} from "@/models";

export interface RootState {
   ui: UIState,
   profile: ProfileState,
   problems: ProblemsState
}

export interface RootGetters {
   platform: Platform,
   isSideBarVisible: boolean,
   isTextPage: boolean,
   openProblems: Array<FullProblem>,
   closedProblems: Array<FullProblem>,
   problems: Array<FullProblem>,
   currentProblem?: FullProblem
}

export interface IActionContext<S> extends ActionContext<S, RootState> {
   rootGetters: RootGetters
}
