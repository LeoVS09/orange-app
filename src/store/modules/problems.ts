import * as actionTypes from '../actionTypes'

import {IActionContext, ProblemsState, Problem} from "../../state";

const SET_OPEN_PROBLEMS = 'SET_OPEN_PROBLEMS';
const ADD_OPEN_PROBLEM = 'ADD_OPEN_PROBLEM';
const initState: ProblemsState = {
  openProblems: []
};

export default {
  state: initState,

  actions: {
    [actionTypes.SETUP_OPEN_PROBLEMS] (context: IActionContext<ProblemsState>, problems: Array<Problem>) {
      context.commit(SET_OPEN_PROBLEMS, problems);
    },
    [actionTypes.ADD_OPEN_PROBLEM] (context: IActionContext<ProblemsState>, problem: Problem) {
      context.commit(ADD_OPEN_PROBLEM, problem);
    }
  },

  mutations: {
    [SET_OPEN_PROBLEMS] (state: ProblemsState, problems: Array<Problem>) {
      state.openProblems = problems
    },
    [ADD_OPEN_PROBLEM] (state: ProblemsState, problem: Problem) {
      state.openProblems.push(problem)
    }
  }
}
