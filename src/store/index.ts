import Vue, {PluginObject} from 'vue'
import * as Vuex from 'vuex'

import createDataGeneratorPlugin from './plugins/mock/generator'

import ui from './modules/ui'
import profile from './modules/profile'
import problems from './modules/problems'
import getters from './getters'

// @ts-ignore
const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex as any);

const generator = createDataGeneratorPlugin();

export default new Vuex.Store({
  modules: {
    ui,
    profile,
    problems
  },
  getters,
  plugins: [generator],
  strict: debug
});
