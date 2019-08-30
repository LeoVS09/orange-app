// @ts-ignore
import * as Router from 'vue-router'
import { ROUTES } from './rotues'
import { checkIsLogin } from '@/authentication'
import store from '@/store'
import * as actions from '@/store/actionTypes'
import { FullProblem, PartialProblem } from '@/models'
import { ModelReadState } from '@/store/modules/statuses/types'
import { GET_READ_STATE } from '@/store/modules/statuses/getters'
import { STATUS_SCOPES } from '@/store/statusScopes'
import { FullContest } from '@/models/contest'

const { actionName, MODULES } = actions

const guard = (useAuthComponent: boolean): Router.NavigationGuard => (to: Router.Route, from: Router.Route, next: Function) => {
  if (!useAuthComponent) {
    next()
    return
  }

  const resultCheck = checkIsLogin()
  if (!resultCheck.ok) {
    switch (to.name) {
      case ROUTES.PROFILE:
        next({ name: ROUTES.SIGNIN, query: { from: to.name } })
        break
      case ROUTES.CREATE_PROBLEM:
        next({ name: ROUTES.SIGNIN, query: { from: to.name } })
        break
      default:
        next()
    }
    return
  }

  if (to.name === ROUTES.PROFILE) {
    const profile = store.state.profile.data
    if (!profile) {
      next({ name: ROUTES.SIGNIN, query: { from: to.name } })
      return
    }
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

  next()
}

export default guard

export function contestMiddleware(to: Router.Route, from: Router.Route, next: Function) {
  switch (to.name) {
    case ROUTES.CREATE_CONTEST:
      store.dispatch(actionName(MODULES.CONTESTS, actions.ADD_MODEL_FOR_CREATE))
        .then((contest: FullContest) => {
          to.params.id = contest.id
          next()
        })
  }
}

export function problemMiddleware(to: Router.Route, from: Router.Route, next: Function) {
  // create async guard generator
  switch (to.name) {
    case ROUTES.CREATE_PROBLEM:
      store.dispatch(actionName(MODULES.PROBLEMS, actions.ADD_MODEL_FOR_CREATE))
        .then((problem: FullProblem) => {
          to.params.id = problem.id
          next()
        })

      return

    case ROUTES.PROBLEM: {
      const problem = store.state.problems.data.find((p: PartialProblem | FullProblem) => p.id === to.params.id)

      if (!problem || store.getters[GET_READ_STATE](STATUS_SCOPES.PROBLEMS, problem.id) !== ModelReadState.Full) {
        store.dispatch(actionName(MODULES.PROBLEMS, actions.READ), to.params.id)
          .then((fullProblem: FullProblem) => {
            if (fullProblem)
              return

            console.error('Not have problem')
          })
      }
      next()
      return
    }
  }

  next()
}
