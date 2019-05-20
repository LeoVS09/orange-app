// @ts-ignore
import Router from 'vue-router'
import {ROUTES} from './rotues'
import {checkIsLogin} from "@/authentication";
import store from '@/store'
import * as actions from '@/store/actionTypes';
import {ProblemReadState} from "@/models/problem";

const guard = (useAuthComponent: boolean): Router.NavigationGuard =>
   (to: Router.Route, from: Router.Route, next: Function) => {

      if (!useAuthComponent) {
         next();
         return;
      }

      const resultCheck = checkIsLogin();
      if (!resultCheck.ok) {

         switch (to.name) {
            case ROUTES.PROFILE:
               next({name: ROUTES.SIGNIN});
               break;
            case ROUTES.CREATE_PROBLEM:
               next({name: ROUTES.SIGNIN});
               break;
            default:
               next();
         }
         return
      }

      // if(resultCheck.user.type === UserType.CONTESTANT) {
      //   switch (to.name) {
      //     case ROUTES.CREATE_PROBLEM: next({name: ROUTES.HOME});
      //       break;
      //     default:
      //       next();
      //   }
      //   return
      // }

      next();
      return;
}

export default guard

export function problemMiddleware(to: Router.Route, from: Router.Route, next: Function){

   // create async guard generator
   switch (to.name) {
      case ROUTES.CREATE_PROBLEM:
         store.dispatch(actions.ADD_FOR_CREATE_PROBLEM)
            .then(problem => {
               to.params.id = problem.id
               next()
            })

         return

      case ROUTES.PROBLEM:
         const problem = store.state.problems.data.find(p => p.id === to.params.id)
         if(!problem || problem.readState === ProblemReadState.Partial)
            store.dispatch(actions.READ_PROBLEM, to.params.id)
               .then(problem => {
                  if(problem)
                     return

                  console.log('Not have problem')
               })
         next()
         return;
   }

   next()
}
