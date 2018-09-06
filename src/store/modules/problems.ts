import * as actionTypes from '../actionTypes';
import {API} from '../../api';
import {IActionContext, ProblemsState, Problem, ResultRunProgram} from "../../state";

const SET_PROBLEMS = 'SET_PROBLEMS';
const ADD_PROBLEM = 'ADD_PROBLEM';
const SET_RESULT_OF_PROGRAM = 'SET_RESULT_OF_PROGRAM';

const initState: ProblemsState = {
  data: []
};

export default {
  state: initState,

  actions: {
    [actionTypes.SETUP_PROBLEMS](context: IActionContext<ProblemsState>, problems: Array<Problem>) {
      context.commit(SET_PROBLEMS, problems);
    },
    [actionTypes.ADD_PROBLEM](context: IActionContext<ProblemsState>, problem: Problem) {
      context.commit(ADD_PROBLEM, problem);
    },
    [actionTypes.UPLOAD_CODE](context: IActionContext<ProblemsState>, {id, text}: {id: string, text: string}) {
      console.log("upload code", text);
      API.runProgram(id, text)
        .then(result => {
          context.commit(SET_RESULT_OF_PROGRAM, result)
        }).catch(e => console.error(e));
    }
  },

  mutations: {
    [SET_PROBLEMS](state: ProblemsState, problems: Array<Problem>) {
      state.data = problems
    },
    [ADD_PROBLEM](state: ProblemsState, problem: Problem) {
      state.data.push(problem)
    },
    [SET_RESULT_OF_PROGRAM](state: ProblemsState, result: ResultRunProgram) {
      state.data = state.data.map(problem => {
        if(problem.id !== result.problemId){
          return problem
        }
        problem.resultRun = result;
        return problem
      })
    }
  }
}
