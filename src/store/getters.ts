import {RootState} from "../state";
import {GetterTree} from "vuex";

const getters: GetterTree<RootState, any> = {
  platform: (state) => state.ui.currentPlatform,
  isSideBarVisible: (state) => state.ui.sideBarVisible,

  profile: (state) => state.profile.data,

  openProblems: (state) => state.problems.data.filter(p => p.isOpen),
  closedProblems: (state) => state.problems.data.filter(p => !p.isOpen),
  problems: (state) => state.problems.data
};

export default getters;
