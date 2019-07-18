import Vue, {PluginObject} from 'vue'
import * as Vuex from 'vuex'

import modules from './modules'
import getters from './getters'

// @ts-ignore
// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

if (DEBUG) {
   console.log('Debug mode enabled')
}
Vue.use(Vuex as any)

export default new Vuex.Store({
   modules,
   getters,
   plugins: [],
   strict: true,
})
