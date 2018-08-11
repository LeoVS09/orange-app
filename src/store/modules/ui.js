import * as actionTypes from '@/store/actionTypes'

const UI_SET_PLATFORM_REPRESENTATION = 'UI_SET_PLATFORM_REPRESENTATION'
const UI_SET_SIDEBAR_VISIBLE_STATUS = 'UI_SET_SIDEBAR_VISIBLE_STATUS'

export default {
  state: {
    currentPlatform: 'desktop',
    sideBarVisible: true
  },

  actions: {
    [actionTypes.SET_PLATFORM] ({ commit, rootGetters }, code) {
      const platform = code === 0 ? 'desktop' : (code === 1 ? 'tablet' : 'mobile')
      if (rootGetters.platform !== platform) {
        commit(UI_SET_PLATFORM_REPRESENTATION, platform)
        commit(UI_SET_SIDEBAR_VISIBLE_STATUS, platform !== 'mobile')
      }
    },
    [actionTypes.TOGGLE_SIDEBAR] ({ commit, rootGetters }) {
      commit(UI_SET_SIDEBAR_VISIBLE_STATUS, !rootGetters.isSideBarVisible)
    }
  },

  mutations: {
    [UI_SET_PLATFORM_REPRESENTATION] (state, platform) {
      state.currentPlatform = platform
    },
    [UI_SET_SIDEBAR_VISIBLE_STATUS] (state, visible) {
      state.sideBarVisible = visible
    }
  }
}
