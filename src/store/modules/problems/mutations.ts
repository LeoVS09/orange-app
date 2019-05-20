import * as mutationTypes from './mutationTypes'
import {
   FullProblem,
   PartialProblem,
   ProblemStatus,
   ProblemTestingStatus,
   ResultRunProgram,
   Test,
   TestStatus,
   ProblemError
} from "@/models";
import {ProblemFilter, ProblemsState} from './state'
import {ProblemReadState, Tag} from "@/models/problem";

export interface IStartTestingSolutionPayload {
   problemId: string
}

export interface ISetProblemStatusPayload {
   problemId: string
   status: ProblemStatus
}

export interface IAddForCreateTestPayload {
   problemId: string
   test: Test
}

export interface ICreateTestPayload {
   problemId: string
   oldTestId: string
   test: Test
}

export interface ICreateProblemPayload {
   oldProblemId: string
   problem: FullProblem
}

export interface IEditTestPayload {
   problemId: string
   test: Test
}

export interface IUpdateTestPayload {
   problemId: string
   test: Test
}

export interface ISetTestStatusPayload {
   problemId: string
   testId: string
   status: TestStatus
}

export default {
   [mutationTypes.SET_PROBLEMS](state: ProblemsState, problems: Array<FullProblem>) {
      state.data = problems
   },

   [mutationTypes.ADD_PROBLEM_FOR_CREATE](state: ProblemsState, problem: FullProblem) {
      problem.status = ProblemStatus.ForCreate
      state.data.push(problem)
   },

   [mutationTypes.ADD_PARTIAL_READ_PROBLEM](state: ProblemsState, problem: PartialProblem) {
      problem.status = ProblemStatus.Synced
      problem.readState = ProblemReadState.Partial
      state.data.push(problem)
   },

   [mutationTypes.ADD_FULL_READ_PROBLEM](state: ProblemsState, problem: FullProblem) {
      problem.status = ProblemStatus.Synced
      problem.readState = ProblemReadState.Full
      state.data.push(problem)
   },

   [mutationTypes.CREATE_PROBLEM](state: ProblemsState, {oldProblemId, problem}: ICreateProblemPayload) {
      updateProblemWithId(state, oldProblemId, t => {
         problem.status = ProblemStatus.Synced
         return problem
      })
   },

   [mutationTypes.EDIT_PROBLEM](state: ProblemsState, problem: FullProblem) {
      updateProblemWithId(state, problem.id, p => {
         problem.status = ProblemStatus.Changed
         return problem;
      })
   },

   [mutationTypes.UPDATE_PROBLEM](state: ProblemsState, problem: FullProblem | PartialProblem) {
      updateProblemWithId(state, problem.id, p => {
         problem.status = ProblemStatus.Synced
         return problem;
      })
   },

   [mutationTypes.START_TESTING_SOLUTION](state: ProblemsState, {problemId}:IStartTestingSolutionPayload) {
     updateProblemWithId(state, problemId, problem => {
        problem.testingStatus = ProblemTestingStatus.Testing
        return problem
     })
   },

   [mutationTypes.SET_RESULT_OF_SOLUTION_RUN](state: ProblemsState, result: ResultRunProgram) {
      updateProblemWithId(state, result.problemId, problem => {
         if(problem.readState === ProblemReadState.Partial) {
            console.error('Cannot set solution run result of partial problem')
            return problem
         }

         if(result.isUnexpectedError)
            problem.testingStatus = ProblemTestingStatus.Error
         else if(result.isAllTestsSuccessful)
            problem.testingStatus = ProblemTestingStatus.Solved
         else
            problem.testingStatus = ProblemTestingStatus.AlmostSolved

         problem.resultRun = result
         return problem
      })
   },

   [mutationTypes.SET_PROBLEM_STATUS](state: ProblemsState, {problemId, status}: ISetProblemStatusPayload) {
      updateProblemWithId(state, problemId, problem => {
         problem.status = status
         return problem
      })
   },

   [mutationTypes.ADD_TEST_FOR_CREATE](state: ProblemsState, {problemId, test}: IAddForCreateTestPayload) {
      updateProblemWithId(state, problemId, problem => {
         if (problem.readState === ProblemReadState.Partial) {
            console.error('Cannot add test to partial problem')
            return problem
         }

         problem.tests.push({
            ...test,
            status: TestStatus.ForCreate
         })

         problem.status = ProblemStatus.Changed
         return problem;
      })
   },

   [mutationTypes.CREATE_TEST](state: ProblemsState, {problemId, oldTestId, test}: ICreateTestPayload) {
      updateTestWithId(state, problemId, oldTestId, t => {
         test.status = TestStatus.Synced
         return test
      })
   },
   [mutationTypes.EDIT_TEST](state: ProblemsState, {problemId, test}: IEditTestPayload) {
      updateTestWithId(state, problemId, test.id, t => {
         test.status = TestStatus.Changed
         return Object.assign(t, test)
      })
   },
   [mutationTypes.UPDATE_TEST](state: ProblemsState, {problemId, test}: IUpdateTestPayload) {
      updateTestWithId(state, problemId, test.id, t => {
         test.status = TestStatus.Synced
         return Object.assign(t, test)
      })
   },
   [mutationTypes.SET_TEST_STATUS](state: ProblemsState, {problemId, testId, status}: ISetTestStatusPayload) {
      updateTestWithId(state, problemId, testId, t => {
         t.status = status
         return t
      })
   },
   [mutationTypes.ADD_PROBLEM_ERROR](state: ProblemsState, error: ProblemError) {
      state.errorHistory.push(error)
   },

   [mutationTypes.SET_PROBLEMS_FILTER](state: ProblemsState, filter: ProblemFilter) {
      state.filter = filter
   },

   [mutationTypes.SET_TAGS](state: ProblemsState, tags: Array<Tag>) {
      state.tags = tags
   },

   [mutationTypes.ADD_FILTER_TAG](state: ProblemsState, tag: Tag) {
      state.filterTags.push(tag)
   },

   [mutationTypes.REMOVE_FILTER_TAG](state: ProblemsState, index: number) {
      state.filterTags = [...state.filterTags.slice(0, index), ...state.filterTags.slice(index+1)]
   },

   [mutationTypes.TOGGLE_FILER_TAG](state: ProblemsState, tag: Tag) {
      const index = state.filterTags.findIndex(item => item.id === tag.id)
      if(index === -1) {
         state.filterTags.push(tag)
         return
      }

      state.filterTags = [...state.filterTags.slice(0, index), ...state.filterTags.slice(index+1)]
   },
}

function updateProblemWithId(state: ProblemsState, problemId: string, handler: (problem: FullProblem | PartialProblem) => FullProblem | PartialProblem) {
   state.data = state.data.map(p => {
      if (p.id !== problemId)
         return p;

      return handler(p);
   })
}

function updateTestWithId(state: ProblemsState, problemId: string, testId: string, handler: (test: Test) => Test) {
   updateProblemWithId(state, problemId, problem => {
      if (problem.readState === ProblemReadState.Partial) {
         console.error("Cannot update test of partial problem", problem.name);
         return problem
      }

      problem.tests = problem.tests.map(t => {
         if (t.id !== testId)
            return t

         return handler(t)
      });

      return problem
   })
}
