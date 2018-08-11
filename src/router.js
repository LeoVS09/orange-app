import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/containers/Home.vue'
import Auth from '@/containers/Authorisation.vue'

import Schedule from '@/components/Content/Competitions.vue'

const USE_AUTH_COMPONENT = false

Vue.use(Router)

const authPath = '/authorisation'
const router = new Router({
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: Schedule
        }
      ]
    },
    {
      path: authPath,
      name: 'authorisation',
      component: Auth
    }
  ]
})

const isAuth = () => !USE_AUTH_COMPONENT || !!window.localStorage.token || !!window.sessionStorage.token
router.beforeEach((to, from, next) => {
  if (isAuth()) {
    to.path !== authPath ? next() : next({ path: '/' })
    return
  }
  to.path !== authPath ? next({ path: authPath }) : next()
})

export default router
