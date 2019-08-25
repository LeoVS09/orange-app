import {ROUTES} from '@/router/rotues'
import Vue from 'vue'
// @ts-ignore
import Router from 'vue-router'
import {Component} from 'vue-router/types/router'
import Home from '@/layouts/Home.vue'
import Authorisation from '@/layouts/Authorisation.vue'
import Contests from '@/pages/Contests.vue'
import Contest from '@/pages/Contest.vue'
import Problems from '@/pages/Problems.vue'
import Profile from '@/pages/Profile.vue'
import City from '@/pages/City.vue'
import Problem from '@/pages/Problem.vue'
import Countries from '@/pages/Countries.vue'
import Country from '@/pages/Country.vue'
import University from '@/pages/University.vue'
import ProgrammingLanguages from '@/pages/ProgrammingLanguages.vue'
import ProgrammingLanguage from '@/pages/ProgrammingLanguage.vue'
import SignIn from '@/pages/SignIn.vue'
import SignUp from '@/pages/SignUp.vue'

import guard, {contestMiddleware, problemMiddleware} from './middlewares'

export {
   ROUTES,
}

const authPath = '/signin'
const USE_AUTH_COMPONENT = true

Vue.use(Router)

const router = new Router({
   mode: 'history',
   routes: [
      {
         path: '/',
         component: Home as Component,
         children: [
            {
               name: ROUTES.HOME,
               path: '',
               component: Problems as Component,
            },
            {
               name: ROUTES.CONTESTS,
               path: '/contests',
               component: Contests as Component,
            },
            {
               name: ROUTES.CONTEST,
               path: '/contests/:id',
               component: Contest as Component,
               props: true,
            },
            {
               name: ROUTES.CREATE_CONTEST,
               path: '/contests/create',
               component: Contest as Component,
               beforeEnter: contestMiddleware,
               props: true,
            },
            {
               path: '/problems/create',
               name: ROUTES.CREATE_PROBLEM,
               component: Problem as Component,
               beforeEnter: problemMiddleware,
               props: true,
            },
            {
               path: '/problems/:id',
               name: ROUTES.PROBLEM,
               component: Problem as Component,
               beforeEnter: problemMiddleware,
               props: true,
            },
            {
               path: '/profile',
               name: ROUTES.PROFILE,
               component: Profile as Component,
            },
            {
               path: '/countries',
               name: ROUTES.COUNTRIES,
               component: Countries as Component,
            },
            {
               path: '/countries/:id',
               name: ROUTES.COUNTRY,
               component: Country as Component,
               props: true,
            },
            {
               path: '/cities/:id',
               name: ROUTES.CITY,
               component: City as Component,
               props: true,
            },
            {
               path: '/universities/:id',
               name: ROUTES.UNIVERSITY,
               component: University as Component,
               props: true,
            },
            {
               path: '/programming-languages',
               name: ROUTES.PROGRAMMING_LANGUAGES,
               component: ProgrammingLanguages as Component,
            },
            {
               path: '/programming-languages/:id',
               name: ROUTES.PROGRAMMING_LANGUAGE,
               component: ProgrammingLanguage as Component,
               props: true,
            },
         ],
      },
      {
         path: '/authorisation',
         name: ROUTES.AUTHORISATION,
         component: Authorisation as Component,
         children: [
            {
               name: ROUTES.SIGNIN,
               path: authPath,
               component: SignIn as Component,
            },
            {
               name: ROUTES.SIGNUP,
               path: '/signup',
               component: SignUp as Component,
            },
         ],
      },
   ],
})

// TODO: go to main page from sign-in if have profile data
router.beforeEach(guard(USE_AUTH_COMPONENT))

export default router
