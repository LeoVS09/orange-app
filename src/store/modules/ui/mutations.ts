import * as mutationTypes from './mutationTypes'
import {
   Platform,
   UIState,
} from "./state";


export default {
   [mutationTypes.UI_SET_PLATFORM_REPRESENTATION](state: UIState, platform: Platform) {
      state.currentPlatform = platform
   },
   [mutationTypes.UI_SET_SIDEBAR_VISIBLE_STATUS](state: UIState, visible: boolean) {
      state.sideBarVisible = visible
   },
   [mutationTypes.UI_SET_SIGN_IN_PAGE_STATUS](state: UIState, value: boolean) {
      state.isSignInPage = value;
   }
}
