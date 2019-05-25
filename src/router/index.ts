import {ROUTES} from "@/router/rotues";
export {
   ROUTES
}

import Vue from 'vue'
// @ts-ignore
import Router from 'vue-router'
import {Component} from "vue-router/types/router"
import Home from '@/containers/pages/Home.vue'
import Authorisation from '@/containers/pages/Authorisation.vue'
import Competitions from '@/containers/views/Competitions.vue'
import Problems from '@/containers/views/Problems'
import Profile from '@/containers/views/Profile.vue'

import Problem from '@/containers/views/Problem.vue'
import * as actions from '@/store/actionTypes';
import Countries from '@/containers/views/Countries'
import Country from '@/containers/views/Country'
import SignIn from '@/containers/views/SignIn.vue'
import SignUp from '@/containers/views/SignUp.vue'

import guard, {problemMiddleware} from "./middlewares";

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
               name: ROUTES.HOME,
               path: '',
               component: Problems as Component
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
               beforeEnter: problemMiddleware
            },
            {
               path: '/problem/:id',
               name: ROUTES.PROBLEM,
               component: Problem as Component,
               beforeEnter: problemMiddleware,
               props: true
            },
            {
               path: '/profile',
               name: ROUTES.PROFILE,
               component: Profile as Component
            },
            {
               path: '/countries',
               name: ROUTES.COUNTRIES,
               component: Countries as Component,
            },
            {
               path: '/country/:id',
               name: ROUTES.COUNTRY,
               component: Country as Component,
               props: true
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
})

// TODO: go to main page from sign-in if have profile data
router.beforeEach(guard(USE_AUTH_COMPONENT));

export default router;
