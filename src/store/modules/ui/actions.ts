import {
   Platform,
   UIState,
} from "./state";
import * as mutations from './mutationTypes'
import * as actionTypes from './actionTypes'
import {IActionContext} from '@/store/state'

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export default {
   [actionTypes.SET_PLATFORM] (context: IActionContext<UIState>, code: number) {
      const platform = code === 0 ? Platform.DESKTOP : (code === 1 ? Platform.TABLET : Platform.MOBILE);
      if (context.rootGetters.platform !== platform) {
         context.commit(mutations.UI_SET_PLATFORM_REPRESENTATION, platform);
         context.commit(mutations.UI_SET_SIDEBAR_VISIBLE_STATUS, platform !== Platform.MOBILE)
      }
   },
   [actionTypes.TOGGLE_SIDEBAR] (context: IActionContext<UIState>) {
      context.commit(mutations.UI_SET_SIDEBAR_VISIBLE_STATUS, !context.rootGetters.isSideBarVisible)
   },
   [actionTypes.SET_SIGN_IN_PAGE] (context: IActionContext<UIState>) {
      context.commit(mutations.UI_SET_SIGN_IN_PAGE_STATUS, true);
   },
   [actionTypes.SET_SIGN_UP_PAGE] (context: IActionContext<UIState>) {
      context.commit(mutations.UI_SET_SIGN_IN_PAGE_STATUS, false);
   }
}
