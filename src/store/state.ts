import {ActionContext} from "vuex";
import {ProblemsState, ProfileState, UIState, Platform, ProblemFilter} from "./modules";
import {City, Country, FullProblem, PartialProblem, University, UserProfile} from "@/models";
import {ProblemError, Tag} from "@/models/problems";
import {ModelStatus, StatusState} from "@/store/modules/statuses";
import {ModelReadState} from "@/store/modules/statuses/types";
import {CrudState} from "@/store/CrudModule";
import TagsState from "@/store/modules/tags/state";

export interface RootState {
   ui: UIState,
   profile: ProfileState,
   problems: ProblemsState,
   statuses: StatusState,
   countries: CrudState<Country>,
   cities: CrudState<City>
   tags: TagsState,
   universities: CrudState<University>
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
   activeFilter: ProblemFilter,

   problemById: (id: string) => FullProblem | PartialProblem | undefined,
   randomProblem: FullProblem | PartialProblem,
   similarProblems: Array<FullProblem | PartialProblem>,

   problemErrorById: (id: string) => ProblemError | undefined

   allCountries: Array<Country>
   allTags: Array<Tag>,
   allCities: Array<City>,
   allUniversities: Array<University>

   filterTags: Array<Tag>

   'statuses/status': (scope: string, id: string) => ModelStatus,
   'statuses/read': (scopes: string, id: string) => ModelReadState
}

export interface IActionContext<S> extends ActionContext<S, RootState> {
   rootGetters: RootGetters
}
