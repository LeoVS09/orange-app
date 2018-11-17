import Vue, {PluginObject} from 'vue'
import * as Vuex from 'vuex'

import createDataGeneratorPlugin from './plugins/mock/generator'

import ui from './modules/ui'
import profile from './modules/profile'
import problems from './modules/problems'
import getters from './getters'

// @ts-ignore
const debug = process.env.NODE_ENV !== 'production';

if(debug) {
  console.log("Debug mode enabled");
}
Vue.use(Vuex as any);

const generator = createDataGeneratorPlugin();

export default new Vuex.Store({
  modules: {
    ui,
    profile,
    problems
  },
  getters,
  plugins: debug ? [generator] : [],
  strict: debug
});
