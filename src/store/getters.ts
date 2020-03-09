import { GetterTree } from 'vuex'
import { FullProblem, PartialProblem, UserType } from '@/models'
import { randomItem, shuffleProblem } from '@/store/utils'
import { RootState } from './state'

const getters: GetterTree<RootState, any> = {
  platform: (state) => state.ui.currentPlatform,
  isSideBarVisible: (state) => state.ui.sideBarVisible,
  isSignInPage: (state) => state.ui.isSignInPage,
  locale: (state) => state.ui.locale,

  profile: (state) => state.profile.data,
  isTeacher: (state) => (state.profile.data ? state.profile.data.type === UserType.TEACHER : false),

  problems: (state) => state.problems.data,

  problemById: (state) => (id: string) => state.problems.data.find((p) => p.id === id),
  randomProblem: (state) => randomItem(state.problems.data),
  similarProblems: (state) => (id: string) => findSimilarProblems(state.problems.data, id),

  problemErrorById: (state) => (id: string) => state.problems.errorHistory.find((e) => e.problemId === id),

  contests: (state) => state.contests.data,
  contestById: (state) => (id: string) => state.contests.data.find((c) => c.id === id),

  allCountries: (state) => state.countries.data,
  countryById: (state) => (id: string) => state.countries.data.find((c) => c.id === id),

  allCities: (state) => state.cities.data,
  cityById: (state) => (id: string) => state.cities.data.find((c) => c.id === id),

  allUniversities: (state) => state.universities.data,
  universityById: (state) => (id: string) => state.universities.data.find((u) => u.id === id),

  allTags: (state) => state.tags.data,
  tagById: (state) => (id: string) => state.tags.data.find((t) => t.id === id)
}

export default getters

function findSimilarProblems(problems: Array<PartialProblem | FullProblem>, id: string): Array<PartialProblem | FullProblem> {
  // TODO: algorithm for findOne similar problem

  const anotherProblems = problems.filter((p) => p.id !== id)

  return shuffleProblem(anotherProblems)
}
