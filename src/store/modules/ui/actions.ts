import {
   Platform, Translation,
   UIState,
} from './state'
import * as mutations from './mutationTypes'
import * as actionTypes from './actionTypes'
import {IActionContext} from '@/store/state'
import loadable from '@/components/mixins/loadable'

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

const SET_LOCALE_TRANSLATION = 'i18n/setLocale'

export default {
   [actionTypes.SET_PLATFORM]({commit, rootGetters }: IActionContext<UIState>, code: number) {
      const platform = code === 0 ? Platform.DESKTOP : (code === 1 ? Platform.TABLET : Platform.MOBILE)
      if (rootGetters.platform !== platform) {
         commit(mutations.UI_SET_PLATFORM_REPRESENTATION, platform)
         commit(mutations.UI_SET_SIDEBAR_VISIBLE_STATUS, platform !== Platform.MOBILE)
      }
   },
   [actionTypes.TOGGLE_SIDEBAR]({commit, rootGetters}: IActionContext<UIState>) {
      commit(mutations.UI_SET_SIDEBAR_VISIBLE_STATUS, !rootGetters.isSideBarVisible)
   },
   [actionTypes.SET_SIGN_IN_PAGE]({commit}: IActionContext<UIState>) {
      commit(mutations.UI_SET_SIGN_IN_PAGE_STATUS, true)
   },
   [actionTypes.SET_SIGN_UP_PAGE]({commit}: IActionContext<UIState>) {
      commit(mutations.UI_SET_SIGN_IN_PAGE_STATUS, false)
   },
   [actionTypes.SET_LOCALE]({commit, dispatch}: IActionContext<UIState>, locale: Translation) {
      commit(mutations.SET_LOCALE, locale)
      dispatch(SET_LOCALE_TRANSLATION, {locale}, {root: true})
   },
}
