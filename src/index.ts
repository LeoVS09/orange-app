// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import store from './store/index'
import router from './router'
import { UIEventEmitter, UIEvents } from './utils/UIEventEmitter'

// TODO lodash types
// @ts-ignore
import throttle from 'lodash.throttle'

import * as actionTypes from './store/actionTypes'

Vue.config.productionTip = false;

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

// @ts-ignore no-new
new Vue({
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app');
