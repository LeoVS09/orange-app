import Vue from 'vue'
// @ts-ignore
import Router from 'vue-router'
import {Component} from "../node_modules/vue-router/types/router"
import {checkIsLogin} from "./identity";
import Home from '@/containers/Home.vue'
import Authorisation from '@/containers/Authorisation.vue'
import Competitions from '@/containers/Content/Competitions.vue'
import ProblemsList from '@/containers/Content/ProblemsList.vue'
import Profile from '@/containers/Content/Profile.vue'
import Problem from '@/containers/Content/Problem.vue'
import SignIn from '@/containers/Content/SignIn.vue'

const authPath = '/signin';
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
        },
        {
          path: '/profile',
          name: 'profile',
          component: Profile as Component
        }
      ]
    },
    {
      path: '/authorisation',
      name: 'authorisation',
      component: Authorisation as Component,
      children: [
        {
          name: 'signin',
          path: authPath,
          component: SignIn as Component
        }
      ]
    }
  ]
});


const isAuth = () => !USE_AUTH_COMPONENT || checkIsLogin();

router.beforeEach((to: Router.Route, from: Router.Route, next: Function) => {
  if (isAuth()) {
    to.path !== authPath ? next() : next({ path: '/' });
    return
  }

  next();
});

export default router
