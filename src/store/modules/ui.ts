// @ts-ignore
import * as actionTypes from '@/store/actionTypes'
import {Commit} from 'vuex'
import {UIState, Platform, IActionContext} from "../../state";

const UI_SET_PLATFORM_REPRESENTATION = 'UI_SET_PLATFORM_REPRESENTATION';
const UI_SET_SIDEBAR_VISIBLE_STATUS = 'UI_SET_SIDEBAR_VISIBLE_STATUS';
const UI_SET_SIGN_IN_PAGE_STATUS = 'UI_SET_SIGN_IN_PAGE_STATUS';

const initState: UIState = {
  currentPlatform: Platform.DESKTOP,
  sideBarVisible: true,
  isSignInPage: true
};

export default {
  state: initState,

  actions: {
    [actionTypes.SET_PLATFORM] (context: IActionContext<UIState>, code: number) {
      const platform = code === 0 ? Platform.DESKTOP : (code === 1 ? Platform.TABLET : Platform.MOBILE);
      if (context.rootGetters.platform !== platform) {
        context.commit(UI_SET_PLATFORM_REPRESENTATION, platform);
        context.commit(UI_SET_SIDEBAR_VISIBLE_STATUS, platform !== Platform.MOBILE)
      }
    },
    [actionTypes.TOGGLE_SIDEBAR] (context: IActionContext<UIState>) {
      context.commit(UI_SET_SIDEBAR_VISIBLE_STATUS, !context.rootGetters.isSideBarVisible)
    },
    [actionTypes.SET_SIGN_IN_PAGE] (context: IActionContext<UIState>) {
      context.commit(UI_SET_SIGN_IN_PAGE_STATUS, true);
    },
    [actionTypes.SET_SIGN_UP_PAGE] (context: IActionContext<UIState>) {
      context.commit(UI_SET_SIGN_IN_PAGE_STATUS, false);
    }
  },

  mutations: {
    [UI_SET_PLATFORM_REPRESENTATION] (state: UIState, platform: Platform) {
      state.currentPlatform = platform
    },
    [UI_SET_SIDEBAR_VISIBLE_STATUS] (state: UIState, visible: boolean) {
      state.sideBarVisible = visible
    },
    [UI_SET_SIGN_IN_PAGE_STATUS] (state: UIState, value: boolean) {
      state.isSignInPage = value;
    }
  }
}
