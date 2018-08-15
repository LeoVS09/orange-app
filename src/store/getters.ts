import {RootState} from "../state";

export default {
  platform: (state: RootState) => state.ui.currentPlatform,
  isSideBarVisible: (state: RootState) => state.ui.sideBarVisible,

  profile: (state: RootState) => state.profile.data
}
