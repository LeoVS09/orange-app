import {RootState, UserType} from "../state";
import {GetterTree} from "vuex";
import {checkIsLogin} from "../identity";

const getters: GetterTree<RootState, any> = {
  platform: (state) => state.ui.currentPlatform,
  isSideBarVisible: (state) => state.ui.sideBarVisible,
  isTextPage: (state) => state.ui.isTextPage,
  isSignInPage: (state) => state.ui.isSignInPage,

  profile: (state) => {
    let login = checkIsLogin();

    if(!login.ok) {
      return undefined;
    }

    if(!state.profile.data) {
      console.error("Unexpected situation in identity system");
      return undefined;
    }

    if(state.profile.data.id == login.id){
      return state.profile.data
    }

    console.error("Unexpected situation in identity system");
    return undefined;
  },
  isTeacher: (state) => !!state.profile.data ? state.profile.data.type === UserType.TEACHER : false,

  openProblems: (state) => state.problems.data.filter(p => p.isOpen),
  closedProblems: (state) => state.problems.data.filter(p => !p.isOpen),
  problems: (state) => state.problems.data,
  currentProblem: (state) => state.problems.data.filter( p => p.id == state.problems.currentProblemId)[0]
};

export default getters;
