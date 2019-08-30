import {
  defaultTest, FullProblem, PartialProblem, Test,
} from '@/models'
import { IActionContext, RootGetters } from '@/store/state'
import { findById } from '@/store/CrudModule/actions/utils'
import { GET_READ_STATE } from '@/store/modules/statuses/getters'
import { STATUS_SCOPES } from '@/store/statusScopes'
import { ModelReadState } from '@/store/modules/statuses/types'
import * as fragments from '@/api/database/fragments/types'
import * as actionTypes from '@/store/modules/problems/actionTypes'
import { ProblemsState } from '@/store/modules'
import { generateStatusManipulation } from '@/store/modules/statuses/utils'
import * as mutations from '@/store/modules/problems/mutationTypes'
import {
  addModelForCreateAction, createAction, deleteAction, editAction, updateAction,
} from '@/store/CrudModule'
import * as API from '@/api'
import { TestInput } from '@/api/database/global-types'

export interface IAddForCreateTestActionPayload {
   problemId: string
   index: number
}

export interface IUpdateTestActionPayload {
   problemId: string
   testId: string
}

export interface IDeleteTestActionPayload {
   problemId: string
   testId: string
}

export default {
  [actionTypes.EDIT_TEST]({ state, commit, rootGetters }: IActionContext<ProblemsState>, test: Test): boolean {
    const problem = getProblemIfFull(state.data, rootGetters, test.problemId)
    if (!problem)
      return false

    const { tests } = problem as FullProblem
    const old = tests.find(t => t.id === test.id)
    if (!old)
      return false

    const statusManipulations = generateStatusManipulation(STATUS_SCOPES.TESTS, commit, rootGetters)
    const setOrAddMutation = (m: Test) => commit(mutations.SET_OR_ADD_TEST, m)
    const edit = (m: Test) => editAction(problem.tests, m, setOrAddMutation, statusManipulations)

    if (old.index < test.index) {
      tests.forEach((t) => {
        if (t.index <= old.index || t.index > test.index)
          return

        edit({
          ...t,
          index: t.index - 1,
        })
      })
    }

    if (old.index > test.index) {
      tests.forEach((t) => {
        if (t.index >= old.index || t.index < test.index)
          return

        edit({
          ...t,
          index: t.index + 1,
        })
      })
    }

    return edit(test)
  },

  [actionTypes.ADD_FOR_CREATE_TEST]({ state, commit, rootGetters }: IActionContext<ProblemsState>, { problemId, index }: IAddForCreateTestActionPayload): Test | undefined {
    const problem = getProblemIfFull(state.data, rootGetters, problemId)
    if (!problem)
      return

    const statusManipulations = generateStatusManipulation(STATUS_SCOPES.TESTS, commit, rootGetters)
    const setOrAddMutation = (m: Test) => commit(mutations.SET_OR_ADD_TEST, m)
    const edit = (m: Test) => editAction(problem.tests, m, setOrAddMutation, statusManipulations)

    const { tests } = problem as FullProblem
    tests.forEach((t) => {
      if (t.index < index)
        return

      edit({
        ...t,
        index: t.index + 1,
      })
    })

    return addModelForCreateAction(
      tests,
      () => ({
        ...defaultTest(),
        index,
        problemId,
      }),
      m => commit(mutations.SET_OR_ADD_TEST, m),
      statusManipulations,
    )
  },

  async [actionTypes.CREATE_TEST]({ state, commit, rootGetters }: IActionContext<ProblemsState>, test: Test): Promise<Test | undefined> {
    const problem = getProblemIfFull(state.data, rootGetters, test.problemId)
    if (!problem)
      return

    return await createAction(
      problem.tests,
      test,
      payload => commit(mutations.SET_BY_ID_TEST, payload),
      generateStatusManipulation(STATUS_SCOPES.TESTS, commit, rootGetters),
      async t => responseToTest(await API.createTest({ input: { test: testToInput(t) } })),
    )
  },

  async [actionTypes.UPDATE_TEST]({ state, commit, rootGetters }: IActionContext<ProblemsState>, { problemId, testId }: IUpdateTestActionPayload): Promise<Test | undefined> {
    const problem = getProblemIfFull(state.data, rootGetters, problemId)
    if (!problem)
      return

    return await updateAction(
      problem.tests,
      testId,
      m => commit(mutations.SET_BY_ID_TEST, m),
      generateStatusManipulation(STATUS_SCOPES.TESTS, commit, rootGetters),
      async test => responseToTest(await API.updateTest({
        input: {
          id: test.id,
          patch: testToInput(test),
        },
      })),
    )
  },

  async [actionTypes.DELETE_TEST]({ state, commit, rootGetters }: IActionContext<ProblemsState>, { problemId, testId }: IDeleteTestActionPayload): Promise<Test | undefined> {
    const problem = getProblemIfFull(state.data, rootGetters, problemId)
    if (!problem)
      return

    return await deleteAction(
      problem.tests,
      testId,
      id => commit(mutations.DELETE_TEST, problem.tests.find(t => t.id === id)),
      generateStatusManipulation(STATUS_SCOPES.TESTS, commit, rootGetters),
      async id => responseToTest(await API.deleteTest({ input: { id } })),
    )
  },

}

const getProblemIfFull = (problems: Array<PartialProblem | FullProblem>, rootGetters: RootGetters, id: string): FullProblem | undefined => {
  const problem = findById(problems, id)
  if (!problem)
    return

  const readState = rootGetters[GET_READ_STATE](STATUS_SCOPES.PROBLEMS, id)
  if (readState !== ModelReadState.Full)
    return

  return problem as FullProblem
}

function responseToTest(response: fragments.Test | null | undefined): Test | null | undefined {
  if (!response)
    return

  return {
    ...response,
    isPublic: response.isPublic || false,
  }
}

function testToInput(test: Test): TestInput {
  return {
    index: test.index,
    input: test.input,
    output: test.output,
    isPublic: test.isPublic,
    problemId: test.problemId,
  }
}
