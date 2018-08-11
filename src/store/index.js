import Vue from 'vue'
import Vuex from 'vuex'

import createDataGeneratorPlugin from './plugins/mock/generator'

import ui from './modules/ui'

import getters from './getters'

const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

const generator = createDataGeneratorPlugin()

export default new Vuex.Store({
  modules: {
    ui
  },
  getters,
  plugins: [generator],
  strict: debug
})
