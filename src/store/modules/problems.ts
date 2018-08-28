import * as actionTypes from '../actionTypes'

import {IActionContext, ProblemsState, Problem} from "../../state";
import axios from 'axios';

const SET_PROBLEMS = 'SET_PROBLEMS';
const ADD_PROBLEM = 'ADD_PROBLEM';
const initState: ProblemsState = {
  data: []
};

export default {
  state: initState,

  actions: {
    [actionTypes.SETUP_PROBLEMS] (context: IActionContext<ProblemsState>, problems: Array<Problem>) {
      context.commit(SET_PROBLEMS, problems);
    },
    [actionTypes.ADD_PROBLEM] (context: IActionContext<ProblemsState>, problem: Problem) {
      context.commit(ADD_PROBLEM, problem);
    },
    [actionTypes.UPLOAD_CODE] (context: IActionContext<ProblemsState>, text: String) {
      console.log("upload code", text);
      axios.post("http://localhost:3010/run", {
        body: text
      }).then(response => {
        console.log(response)
      })
        .catch(e => console.error(e))
    }
  },

  mutations: {
    [SET_PROBLEMS] (state: ProblemsState, problems: Array<Problem>) {
      state.data = problems
    },
    [ADD_PROBLEM] (state: ProblemsState, problem: Problem) {
      state.data.push(problem)
    }
  }
}
