// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import store from './store'
import setTranslations from './translations'
import router from './router'
import { UIEventEmitter, UIEvents } from './utils/UIEventEmitter'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import Filters from '@/components/filter'

Vue.use(vClickOutside)

setTranslations()

// TODO lodash types
// @ts-ignore
import throttle from 'lodash.throttle'

import * as actionTypes from './store/actionTypes'
import {formatDate, isDate} from "@/components/utils";

Vue.config.productionTip = false;

Vue.use(Filters)

sync(store, router);

function setPlatformAnalysis () {
  const determinePlatform = () => {
    const currentWidth = window.innerWidth;
    [1200, 820, 0].some((widthValue, index) => {
      if (currentWidth > widthValue) {
        store.dispatch(actionTypes.SET_PLATFORM, index);
        return true
      }
      return false
    })
  };

  const resizeEvent = throttle(() => {
    UIEventEmitter.$emit(UIEvents.WINDOW_RESIZE);

    determinePlatform()
  }, 75);
  window.addEventListener('resize', resizeEvent);

  determinePlatform()
}
setPlatformAnalysis();

// @ts-ignore
window.debugState = () => {
  return (() => JSON.parse(JSON.stringify(store.state)))()
};

// @ts-ignore no-newValue
new Vue({
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app');

