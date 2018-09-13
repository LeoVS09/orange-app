import * as actionTypes from '../actionTypes';
import * as API from '../../api';
import {IActionContext, ProblemsState, Problem, ResultRunProgram} from "../../state";
import {createProblem} from "../plugins/mock/generator";

const SET_PROBLEMS = 'SET_PROBLEMS';
const ADD_PROBLEM = 'ADD_PROBLEM';
const SET_RESULT_OF_PROGRAM = 'SET_RESULT_OF_PROGRAM';
const SET_CURRENT_PROBLEM = 'SET_CURRENT_PROBLEM';

const initState: ProblemsState = {
  data: [],
  currentProblemId: undefined
};

export default {
  state: initState,

  actions: {
    [actionTypes.SYNC_PROBLEMS](context: IActionContext<ProblemsState>){
      let count = 10;
      let add = () => {
        setTimeout(() => {
          context.commit(ADD_PROBLEM, {...createProblem(), isOpen: true});
          if(count-- > 0) {
            add();
          }
        }, 100)
      };
      add();
    },
    [actionTypes.SET_CURRRENT_PROBLEM](context: IActionContext<ProblemsState>, problemId: string): Promise<any> {
      console.log("Problem params id", problemId);

      let problem = context.getters.problems.filter((p: Problem) => p.id === problemId)[0];
      if(!!problem) {
        console.log("find current problem id", problemId);
        context.commit(SET_CURRENT_PROBLEM, problemId);
        return Promise.resolve(true)
      }

      return API.getProblem(problemId)
        .then(problem => {
          console.log("load current problem id", problemId);
          context.commit(ADD_PROBLEM, problem);
          context.commit(SET_CURRENT_PROBLEM, problemId);
          return Promise.resolve(true)
        })
    },

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
    [SET_CURRENT_PROBLEM](state: ProblemsState, problemId: string) {
      state.currentProblemId = problemId;
    },

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
