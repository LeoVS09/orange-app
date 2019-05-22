import {RootState, } from "./state";
import {GetterTree} from "vuex";
import {FullProblem, PartialProblem, UserType} from '@/models'
import {randomItem, shuffleProblem} from "@/store/utils";
import {ProblemsState, ProblemFilter} from "@/store/modules";
import {Tag} from "@/models/problems";

const getters: GetterTree<RootState, any> = {
   platform: state => state.ui.currentPlatform,
   isSideBarVisible: state => state.ui.sideBarVisible,
   isSignInPage: state => state.ui.isSignInPage,

   profile: state => state.profile.data,
   isTeacher: state => !!state.profile.data ? state.profile.data.type === UserType.TEACHER : false,

   openProblems: state => state.problems.data.filter(p => p.publicationDate <= new Date()),
   closedProblems: state => state.problems.data.filter(p => p.publicationDate > new Date()),
   problems: state => state.problems.data,
   filteredProblems: state => filterProblems(state.problems),

   problemById: state => (id: string) => state.problems.data.find(p => p.id == id),
   randomProblem: state => randomItem(state.problems.data),
   similarProblems: state => (id: string) => findSimilarProblems(state.problems.data, id),

   problemErrorById: state => (id: string) => state.problems.errorHistory.find(e => e.problemId === id),

   allCountries: state => state.profile.countries,
   countryById: state => (id: string) => state.profile.countries.find(c => c.id === id),
   allCities: state => state.profile.cities,

   allTags: state => state.problems.tags
};

export default getters;

function findSimilarProblems(problems: Array<PartialProblem | FullProblem>, id: string): Array<PartialProblem | FullProblem> {
   // TODO: algorithm for find similar problem

   const anotherProblems = problems.filter(p => p.id !== id)

   return shuffleProblem(anotherProblems)
}

function filterProblems(state: ProblemsState): Array<PartialProblem | FullProblem> {
   const {filter, data, filterTags} = state

   const publicated = filterProblemsByPublication(filter, data)

   return filterProblemsByTags(filterTags, publicated)
}

function filterProblemsByPublication(filter: ProblemFilter, data: Array<PartialProblem | FullProblem>) {
   const now = new Date()

   if (filter === ProblemFilter.All)
      return data

   if (filter === ProblemFilter.Public)
      return data.filter(p => p.publicationDate && p.publicationDate <= now)

   if (filter === ProblemFilter.NotPublic)
      return data.filter(p => !p.publicationDate || p.publicationDate > now)

   return data
}

function filterProblemsByTags(tags: Array<Tag>, data: Array<PartialProblem | FullProblem>) {
   if(!tags.length)
      return data

   return data.filter(p =>
      tags.every(tag =>
         p.tags.some(({id}) => tag.id === id)
      )
   )
}
