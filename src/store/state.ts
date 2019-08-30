import { ActionContext } from 'vuex'
import {
  ProblemsState,
  ProfileState,
  UIState,
  Platform,
} from './modules'
import {
  City,
  Country,
  FullProblem,
  PartialContest,
  PartialProblem,
  University,
  UserProfile,
} from '@/models'
import { ProblemError, Tag } from '@/models/problems'
import { ModelStatus, StatusState } from '@/store/modules/statuses'
import { ModelReadState } from '@/store/modules/statuses/types'
import { CrudState } from '@/store/CrudModule'
import TagsState from '@/store/modules/tags/state'
import { Translation } from '@/store/modules/ui/state'
import { FullContest } from '@/models/contest'

export interface RootState {
   ui: UIState
   profile: ProfileState
   problems: ProblemsState
   statuses: StatusState
   countries: CrudState<Country>
   cities: CrudState<City>
   tags: TagsState
   universities: CrudState<University>
   contests: CrudState<PartialContest | FullContest>
}

export interface RootGetters {
   platform: Platform
   isSideBarVisible: boolean
   isSignInPage: boolean
   locale: Translation

   profile?: UserProfile
   isTeacher: boolean

   problems: Array<FullProblem | PartialProblem>

   contests: Array<PartialContest | FullContest>
   contestById: (id: string) => PartialContest | FullContest

   problemById: (id: string) => FullProblem | PartialProblem | undefined
   randomProblem: FullProblem | PartialProblem
   similarProblems: Array<FullProblem | PartialProblem>

   problemErrorById: (id: string) => ProblemError | undefined

   allCountries: Array<Country>
   allTags: Array<Tag>
   allCities: Array<City>
   allUniversities: Array<University>

   'statuses/status': (scope: string, id: string) => ModelStatus
   'statuses/read': (scopes: string, id: string) => ModelReadState
}

export interface IActionContext<S> extends ActionContext<S, RootState> {
   rootGetters: RootGetters
}
