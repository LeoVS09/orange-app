import {RootState, } from "./state";
import {GetterTree} from "vuex";
import {UserType} from '@/models'

const getters: GetterTree<RootState, any> = {
   platform: state => state.ui.currentPlatform,
   isSideBarVisible: state => state.ui.sideBarVisible,
   isSignInPage: state => state.ui.isSignInPage,

   profile: state => state.profile.data,
   isTeacher: state => !!state.profile.data ? state.profile.data.type === UserType.TEACHER : false,

   openProblems: state => state.problems.data.filter(p => p.publicationDate <= new Date()),
   closedProblems: state => state.problems.data.filter(p => p.publicationDate > new Date()),
   problems: state => state.problems.data,
   problemById: state => (id: string) => state.problems.data.find(p => p.id == id),

   allCountries: state => state.profile.countries
};

export default getters;
