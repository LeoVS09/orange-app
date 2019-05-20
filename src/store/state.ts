import {ActionContext} from "vuex";
import {ProblemsState, ProfileState, UIState, Platform} from "./modules";
import {Country, FullProblem, PartialProblem, UserProfile} from "@/models";
import {ProblemError, Tag} from "@/models/problem";

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

   openProblems: Array<FullProblem | PartialProblem>,
   closedProblems: Array<FullProblem | PartialProblem>,
   problems: Array<FullProblem | PartialProblem>,
   filteredProblems: Array<FullProblem | PartialProblem>,

   problemById: (id: string) => FullProblem | PartialProblem | undefined,
   randomProblem: FullProblem | PartialProblem,
   similarProblems: Array<FullProblem | PartialProblem>,

   problemErrorById: (id: string) => ProblemError | undefined

   allCountries: Array<Country>
   allTags: Array<Tag>
}

export interface IActionContext<S> extends ActionContext<S, RootState> {
   rootGetters: RootGetters
}
