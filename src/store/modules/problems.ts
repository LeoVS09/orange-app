import * as actionTypes from '../actionTypes';
import * as API from '@/api';
import {ResponseDataProblem, ResponseDataTest} from '@/api/graphql/queries/types';
import {
   IActionContext,
   ProblemsState,
   Problem,
   ResultRunProgram,
   Test,
   defaultProblem
} from "../../state";
import * as mock from "../plugins/mock/generator";

const SET_PROBLEMS = 'SET_PROBLEMS';
const ADD_PROBLEM = 'ADD_PROBLEM';
const SET_RESULT_OF_PROGRAM = 'SET_RESULT_OF_PROGRAM';
const SET_CURRENT_PROBLEM = 'SET_CURRENT_PROBLEM';
const ADD_CLEAR_TEST = 'ADD_CLEAR_TEST';
const EDIT_TEST = 'EDIT_TEST';
const SYNC_TEST = 'SYNC_TEST';
const SYNC_NEW_TEST = 'SYNC_NEW_TEST';
const EDIT_PROBLEM = 'EDIT_PROBLEM';
const SYNC_PROBLEM = 'SYNC_PROBLEM';
const UPDATE_CURRENT_PROBLEM = 'UPDATE_CURRENT_PROBLEM';

const initState: ProblemsState = {
   data: [],
   currentProblemId: undefined
};

export function responseToTest(t: ResponseDataTest): Test {
   return {
      id: t.id,
      input: t.input.split('\\n').join(String.fromCharCode(13, 10)), // TODO: dev fix, remove in production
      output: t.output.split('\\n').join(String.fromCharCode(13, 10)),
      synced: true
   }
}

export function responseToProblem(p: ResponseDataProblem): Problem {
   return {
      id: p.id,
      name: p.name,
      description: p.description.split('\\n').join(String.fromCharCode(13, 10)), // TODO: dev fix, remove in production
      note: p.note,
      examples: p.tests.nodes.filter(t => t.public).map(responseToTest),
      isOpen: p.isOpen,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      publishedAt: p.publishedAt,
      author: p.author.user.name,
      tester: p.tester.user.name,
      tags: p.problemsTags.nodes.map(t => ({
         id: t.tag.id,
         name: t.tag.name
      })),
      limits: {
         time: p.limitTime,
         memory: p.limitMemory
      },
      io: {
         input: p.inputType,
         output: p.outputType
      },
      tests: p.tests.nodes.map(responseToTest),
      synced: true
   }
}

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export function mockProblems(context: IActionContext<ProblemsState>) {
   let count = 10;
   let add = () => {
      setTimeout(() => {
         context.commit(ADD_PROBLEM, {...mock.createProblem(), isOpen: true});
         if (count-- > 0) {
            add();
         }
      }, 100)
   };
   add();
}

export default {
   state: initState,

   actions: {
      [actionTypes.SYNC_PROBLEMS](context: IActionContext<ProblemsState>) {

         if (DEBUG) {
            mockProblems(context);
            return
         }

         const {state, commit} = context

         API.problems()
            .then(problems => {
               if (!problems)
                  return console.error('Not found problems')

               problems.forEach(p => {
                  if (!!state.data.find(inState => inState.id === p.id))
                     return console.log('already have this problem', p.name)
                  // TODO: update existing problems

                  commit(ADD_PROBLEM, responseToProblem(p))
               })
            })
      },
      [actionTypes.EDIT_PROBLEM](context: IActionContext<ProblemsState>, problem: Problem) {
         context.commit(EDIT_PROBLEM, problem);
      },
      [actionTypes.SYNC_PROBLEM](context: IActionContext<ProblemsState>, id: string) {
         for (let problem of context.rootGetters.problems) {
            if (problem.id === id) {
               API.syncProblem(problem)
                  .then(result => {
                     if (result.ok) {
                        context.commit(SYNC_PROBLEM, {...problem, result, synced: true});
                     }
                  });
               return;
            }
         }

      },
      [actionTypes.SET_CURRENT_PROBLEM](context: IActionContext<ProblemsState>, problemId: string): Promise<any> {
         console.log("Problem params id", problemId);

         let problem = context.getters.problems.filter((p: Problem) => p.id === problemId)[0];
         if (!!problem) {
            console.log("find current problem id", problemId);
            context.commit(SET_CURRENT_PROBLEM, problemId);
            return Promise.resolve(true)
         }

         return API.problem(problemId)
            .then(result => {
               if(!result) {
                  console.error('Cannot load problem')
                  return false
               }

               const problem = responseToProblem(result)

               console.log("load current problem id", problemId);
               context.commit(ADD_PROBLEM, problem);
               context.commit(SET_CURRENT_PROBLEM, problemId);
               return true
            })
      },

      [actionTypes.SETUP_PROBLEMS](context: IActionContext<ProblemsState>, problems: Array<Problem>) {
         context.commit(SET_PROBLEMS, problems);
      },
      [actionTypes.ADD_PROBLEM](context: IActionContext<ProblemsState>, problem: Problem) {
         context.commit(ADD_PROBLEM, problem);
      },
      [actionTypes.UPLOAD_CODE](context: IActionContext<ProblemsState>, {id, text}: { id: string, text: string }) {
         console.log("upload code", text);
         API.runProgram(id, text)
            .then(result => {
               context.commit(SET_RESULT_OF_PROGRAM, result)
            }).catch(e => console.error(e));
      },
      [actionTypes.ADD_NEW_TEST](context: IActionContext<ProblemsState>) {
         context.commit(ADD_CLEAR_TEST)
      },
      [actionTypes.EDIT_TEST](context: IActionContext<ProblemsState>, test: Test) {
         context.commit(EDIT_TEST, test);

      },
      [actionTypes.SYNC_TEST](context: IActionContext<ProblemsState>, test: Test) {
         if (!!test.input.length && !!test.output.length) {
            API.syncTest(test)
               .then(({ok, id}) => {
                  if (!ok) {
                     console.error("Cannot sync test", id);
                     return
                  }

                  if (test.id.length) {
                     context.commit(SYNC_TEST, id);
                     return
                  }

                  context.commit(SYNC_NEW_TEST, id);
                  context.commit(ADD_CLEAR_TEST);
               });
         }
      },
      [actionTypes.START_CREATE_PROBLEM](context: IActionContext<ProblemsState>) {
         const id = "new";
         context.commit(ADD_PROBLEM, {
            ...defaultProblem(),
            id,
            tests: [{
               id: "",
               input: "",
               output: "",
               synced: false
            }]
         });
         context.commit(SET_CURRENT_PROBLEM, id);
      },
      [actionTypes.CREATE_PROBLEM](context: IActionContext<ProblemsState>, problem: Problem): Promise<any> {
         return API.putCreateProblem(problem)
            .then((result): Promise<any> => {
               if (!result.ok) {
                  console.log("Unexpected result");
                  return Promise.reject();
               }

               context.commit(UPDATE_CURRENT_PROBLEM, {...result.problem, synced: true});
               return Promise.resolve({ok: true, id: result.problem.id});
            })
            .catch((err: any) => {
               console.error('createProblem', err);
            })
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
            if (problem.id !== result.problemId) {
               return problem
            }
            problem.resultRun = result;
            return problem
         })
      },

      [ADD_CLEAR_TEST](state: ProblemsState) {
         state.data = state.data.map(problem => {
            if (problem.id === state.currentProblemId) {
               if (!problem.tests) {
                  problem.tests = []
               }
               problem.tests.push({
                  id: "",
                  input: "",
                  output: "",
                  synced: false
               })
            }
            return problem
         })
      },
      [EDIT_TEST](state: ProblemsState, test: Test) {
         state.data.forEach(problem => {
            if (problem.id !== state.currentProblemId) {
               return
            }

            if (!problem.tests) {
               console.error("Not have tests for edit in problem");
               return
            }

            problem.tests = problem.tests.map(t => {
               if (t.id === test.id) {
                  t.input = test.input;
                  t.output = test.output;
                  t.synced = false;
               }

               return t
            })
         })
      },
      [SYNC_TEST](state: ProblemsState, testId: string) {
         console.log("Sync test", testId);
         state.data.forEach(problem => {
            if (problem.id !== state.currentProblemId) {
               return
            }

            if (!problem.tests) {
               console.error("Not have tests for edit in problem");
               return
            }

            problem.tests = problem.tests.map(t => {
               if (t.id === testId) {
                  t.synced = true;
               }

               return t
            });
            console.log("synced tests", problem.tests);
         })
      },
      [SYNC_NEW_TEST](state: ProblemsState, testId: string) {
         state.data.forEach(problem => {
            if (problem.id !== state.currentProblemId) {
               return
            }

            if (!problem.tests) {
               console.error("Not have tests for edit in problem");
               return
            }

            console.log("Sync new test id", testId);

            problem.tests = problem.tests.map(t => {
               if (t.id.length === 0) {
                  t.id = testId;
                  t.synced = true;
               }

               return t
            })
         })
      },
      [EDIT_PROBLEM](state: ProblemsState, problem: Problem) {
         state.data = state.data.map(p => {
            if (p.id === problem.id) {
               problem.synced = false;
               return problem;
            }
            return p;
         })
      },
      [SYNC_PROBLEM](state: ProblemsState, problem: Problem) {
         state.data = state.data.map(p => {
            if (p.id === problem.id) {
               return problem;
            }
            return p;
         })
      },
      [UPDATE_CURRENT_PROBLEM](state: ProblemsState, problem: Problem) {
         state.data = state.data.map(p => {
            if (p.id === state.currentProblemId) {
               return problem;
            }
            return p
         });

         state.currentProblemId = problem.id;
      }
   }
}
