import {
  FullProblem,
  ProblemTestingStatus,
  ResultRunProgram,
  Test,
  ProblemError
} from '@/models'
import {
  removeById,
  setById,
  setByIdOrPush,
  updateById
} from '@/store/utils'
import { crudMutations, ISetByIdPayload } from '@/store/CrudModule'
import { ProblemsState } from './state'
import * as mutationTypes from './mutationTypes'

export interface IStartTestingSolutionPayload {
  problemId: string
}

export interface ISetTestsPayload {
  problemId: string
  tests: Array<Test>
}

export default {

  ...crudMutations(),

  [mutationTypes.START_TESTING_SOLUTION](state: ProblemsState, { problemId }: IStartTestingSolutionPayload) {
    updateById(state.data, problemId, problem => problem.testingStatus = ProblemTestingStatus.Testing)
  },

  [mutationTypes.SET_RESULT_OF_SOLUTION_RUN](state: ProblemsState, result: ResultRunProgram) {
    updateById(state.data, result.problemId, problem => {
      if (result.isUnexpectedError)
        problem.testingStatus = ProblemTestingStatus.Error
      else if (result.isAllTestsSuccessful)
        problem.testingStatus = ProblemTestingStatus.Solved
      else
        problem.testingStatus = ProblemTestingStatus.AlmostSolved

      const fullProblem = problem as FullProblem
      fullProblem.resultRun = result
    })
  },

  [mutationTypes.SET_TESTS](state: ProblemsState, { problemId, tests }: ISetTestsPayload) {
    updateById(state.data as Array<FullProblem>, problemId, problem => {
      problem.tests = tests
      return problem
    })
  },

  [mutationTypes.SET_OR_ADD_TEST](state: ProblemsState, test: Test) {
    updateById(state.data as Array<FullProblem>, test.problemId, p => setByIdOrPush(p.tests, test))
  },

  [mutationTypes.DELETE_TEST](state: ProblemsState, test: Test) {
    updateById(state.data as Array<FullProblem>, test.problemId, p => p.tests = removeById(p.tests, test.id))
  },

  [mutationTypes.SET_BY_ID_TEST](state: ProblemsState, { id, model }: ISetByIdPayload<Test>) {
    updateById(state.data as Array<FullProblem>, model.problemId, p => setById(p.tests, id, model))
  },

  [mutationTypes.ADD_PROBLEM_ERROR](state: ProblemsState, error: ProblemError) {
    state.errorHistory.push(error)
  }
}
