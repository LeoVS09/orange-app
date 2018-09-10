import Vue from 'vue'
// @ts-ignore
import Router from 'vue-router'
import {Component} from "../node_modules/vue-router/types/router"

import Home from '@/containers/Home.vue'
import Authorisation from '@/containers/Authorisation.vue'
import Competitions from '@/containers/Content/Competitions.vue'
import ProblemsList from '@/containers/Content/ProblemsList.vue'
import Problem from '@/containers/Content/Problem.vue'
import SignIn from '@/containers/Content/SignIn.vue'

const authPath = '/authorisation';
const USE_AUTH_COMPONENT = true;

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home as Component,
      children: [
        {
          name: 'home',
          path: '',
          component: ProblemsList as Component
        },
        {
          path: '/competitions',
          component: Competitions as Component
        },
        {
          path: '/problem/:id',
          name: 'problem',
          component: Problem as Component
        }
      ]
    },
    {
      path: authPath,
      name: 'authorisation',
      component: Authorisation as Component,
      children: [
        {
          name: 'signin',
          path: '',
          component: SignIn as Component
        }
      ]
    }
  ]
});

// @ts-ignore
const isAuth = () => !USE_AUTH_COMPONENT || !!window.localStorage.token || !!window.sessionStorage.token;

// @ts-ignore
router.beforeEach((to, from, next) => {
  //if (isAuth()) {
  //  to.path !== authPath ? next() : next({ path: '/' });
  //  return
  //}
  //to.path !== authPath ? next({ path: authPath }) : next()
  next();
});

export default router
