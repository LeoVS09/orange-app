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
import SignUp from '@/containers/Content/SignUp.vue'
import {UserType} from "./state";

const authPath = '/signin';
const USE_AUTH_COMPONENT = true;

Vue.use(Router);

enum ROUTES {
  HOME = 'home',
  COMPETITIONS = 'competitions',
  CREATE_PROBLEM = 'create problem',
  PROBLEM = 'problem',
  PROFILE = 'profile',
  AUTHORISATION = 'authorisation',
  SIGNIN = 'signin',
  SIGNUP = 'signup'
}

const router = new Router({
  routes: [
    {
      path: '/',
      component: Home as Component,
      children: [
        {
          name: ROUTES.HOME,
          path: '',
          component: ProblemsList as Component
        },
        {
          name: ROUTES.COMPETITIONS,
          path: '/competitions',
          component: Competitions as Component
        },
        {
          path: '/problem/create',
          name: ROUTES.CREATE_PROBLEM,
          component: Problem as Component,
          props: {isCreate: true}
        },
        {
          path: '/problem/:id',
          name: ROUTES.PROBLEM,
          component: Problem as Component
        },
        {
          path: '/profile',
          name: ROUTES.PROFILE,
          component: Profile as Component
        }
      ]
    },
    {
      path: '/authorisation',
      name: ROUTES.AUTHORISATION,
      component: Authorisation as Component,
      children: [
        {
          name: ROUTES.SIGNIN,
          path: authPath,
          component: SignIn as Component
        },
        {
          name: ROUTES.SIGNUP,
          path: '/signup',
          component: SignUp as Component
        }
      ]
    }
  ]
});

router.beforeEach((to: Router.Route, from: Router.Route, next: Function) => {
  if(!USE_AUTH_COMPONENT){
    next();
    return;
  }

  const resultCheck = checkIsLogin();
  if(!resultCheck.ok) {
    switch (to.name) {
      case ROUTES.PROFILE: next({ name: ROUTES.SIGNIN });
        break;
      case ROUTES.CREATE_PROBLEM: next({name: ROUTES.SIGNIN});
        break;
      default:
        next();
    }
    return
  }

  if(resultCheck.user.type === UserType.CONTESTANT) {
    switch (to.name) {
      case ROUTES.CREATE_PROBLEM: next({name: ROUTES.HOME});
        break;
      default:
        next();
    }
    return
  }

  next();
  return;
});

export default router;
