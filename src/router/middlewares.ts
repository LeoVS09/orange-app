// @ts-ignore
import * as Router from 'vue-router'
import { checkIsLogin } from '@/authentication'
import store from '@/store'
import * as actions from '@/store/actionTypes'
import { FullProblem, PartialProblem } from '@/models'
import { ModelReadState } from '@/store/modules/statuses/types'
import { GET_READ_STATE } from '@/store/modules/statuses/getters'
import { STATUS_SCOPES } from '@/store/statusScopes'
import { FullContest } from '@/models/contest'
import { ROUTES } from './routes'

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

