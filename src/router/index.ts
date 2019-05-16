import Vue from 'vue'
// @ts-ignore
import Router from 'vue-router'
import {Component} from "vue-router/types/router"
import {checkIsLogin} from "../authentication";
import Home from '@/containers/Home.vue'
import Authorisation from '@/containers/Authorisation.vue'
import Competitions from '@/containers/Content/Competitions.vue'
import ProblemsList from '@/containers/Content/ProblemsList.vue'
import Profile from '@/containers/Content/Profile.vue'
import Problem from '@/containers/Content/Problem.vue'

import SignIn from '@/containers/Content/SignIn.vue'
import SignUp from '@/containers/Content/SignUp.vue'
import {UserType} from "../models";
import {ROUTES} from "@/router/rotues";
import guard, {problemMiddleware} from "./middlewares";

export {
   ROUTES
}

const authPath = '/signin';
const USE_AUTH_COMPONENT = true;

Vue.use(Router);

const index = new Router({
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
               beforeEnter: problemMiddleware
            },
            {
               path: '/problem/:id',
               name: ROUTES.PROBLEM,
               component: Problem as Component,
               beforeEnter: problemMiddleware
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
})

// TODO: go to main page from sign-in if have profile data
index.beforeEach(guard(USE_AUTH_COMPONENT));

export default index;
