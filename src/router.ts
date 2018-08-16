import Vue from 'vue'
// @ts-ignore
import Router from 'vue-router'
import {Component} from "../node_modules/vue-router/types/router"

import Home from '@/containers/Home.vue'
import Auth from '@/containers/Authorisation.vue'
import Competitions from '@/components/Content/Competitions.vue'
import ProblemsList from '@/components/Content/ProblemsList.vue'

const authPath = '/authorisation';
const USE_AUTH_COMPONENT = false;

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home as Component,
      children: [
        {
          path: '',
          component: ProblemsList as Component
        },
        {
          path: '/competitions',
          component: Competitions as Component
        }
      ]
    },
    {
      path: authPath,
      name: 'authorisation',
      component: Auth as Component
    }
  ]
});

// @ts-ignore
const isAuth = () => !USE_AUTH_COMPONENT || !!window.localStorage.token || !!window.sessionStorage.token;

// @ts-ignore
router.beforeEach((to, from, next) => {
  if (isAuth()) {
    to.path !== authPath ? next() : next({ path: '/' });
    return
  }
  to.path !== authPath ? next({ path: authPath }) : next()
});

export default router
