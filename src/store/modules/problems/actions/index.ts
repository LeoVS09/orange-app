import * as API from '@/api'
import {
  FullProblem,
  PartialProblem,
  ResultRunProgram,
  UserType,
  ProblemTestingStatus,
  PartialUserProfile,
  Tag,
  PartialProgramInput,
  PartialProgramOutput
} from '@/models'
import { IActionContext } from '@/store/state'
import { crudActions } from '@/store/CrudModule'
import { ProblemInput, ProblemsOrderBy } from '@/api/database/global-types'
import { responseToFullProblem, responseToPartialProblem } from '@/store/modules/problems/actions/responseFormat'
import { STATUS_SCOPES } from '@/store/statusScopes'
import { randomId } from '@/components/utils'
import { ProblemsState } from '../state'
import * as mutations from '../mutationTypes'
import * as actionTypes from '../actionTypes'
import { IStartTestingSolutionPayload } from '../mutations'

// TODO: make solution creating
export interface IUploadCodePayload {
   problemId: string
   text: string
}

export {
  IAddForCreateTestActionPayload,
  IDeleteTestActionPayload,
  IUpdateTestActionPayload
} from './tests'

export function defaultProblem(): FullProblem {
  return {
    id: '',
    name: '',
    description: '',
    difficulty: 0,
    note: '',

    createdAt: new Date(),
    updatedAt: new Date(),
    publicationDate: new Date(),

    author: {
      ...defaultPartialProfile(),
      login: 'Author',
      type: UserType.TEACHER
    },

    tester: {
      ...defaultPartialProfile(),
      login: 'Tester',
      type: UserType.TEACHER
    },

    problemsTags: {
      nodes: [],
      totalCount: 0
    },

    // tags: [mockTag('some'), mockTag('tags')],

    limits: {
      time: 30000,
      memory: 2048
    },

    io: {
      input: mockInput('stdin'),
      output: mockOutput('stdout')
    },

    testingStatus: ProblemTestingStatus.NotTested,

    tests: []
  }
}

export function defaultPartialProfile(): PartialUserProfile {
  return {
    id: randomId(),
    userId: randomId(),
    login: 'SomeUser',
    firstName: 'First',
    lastName: 'Last',
    type: UserType.CONTESTANT
  }
}

export function mockTag(name: string): Tag {
  return {
    id: `test-${name}`,
    name,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

export function mockInput(name: string): PartialProgramInput {
  return {
    id: `tests.ts${name}`,
    name
  }
}

export function mockOutput(name: string): PartialProgramOutput {
  return {
    id: `tests.ts${name}`,
    name
  }
}

export default {

  ...crudActions<PartialProblem | FullProblem, ProblemsOrderBy>(
    STATUS_SCOPES.PROBLEMS,
    () => defaultProblem(),
    {
      readList: async variables => {
        const response = await API.problems(variables)
        if (!response)
          return

        return {
          ...response,
          nodes: response.nodes.map(p => responseToPartialProblem(p) as PartialProblem)
        }
      },

      read: async id => responseToFullProblem(await API.problem({ id })),

      create: async (problem: FullProblem) => responseToFullProblem(
        await API.createProblem({
          input: {
            problem: problemToInput(problem)
          }
        })
      ),

      update: async (problem: FullProblem) => responseToFullProblem(
        await API.updateProblem({
          input: {
            id: problem.id,
            patch: problemToInput(problem)
          }
        })
      ),

      delete: async id => responseToPartialProblem(
        await API.deleteProblem({ input: { id } })
      )
    }
  ),

  async [actionTypes.UPLOAD_CODE]({ commit }: IActionContext<ProblemsState>, { problemId, text }: IUploadCodePayload) {
    const payload: IStartTestingSolutionPayload = { problemId }
    commit(mutations.START_TESTING_SOLUTION, payload)

    try {
      const result = await API.runProgram(problemId, text)

      commit(mutations.SET_RESULT_OF_SOLUTION_RUN, result)
    } catch (e) {
      console.error('Error upload code:', e)

      commit(mutations.SET_RESULT_OF_SOLUTION_RUN, {
        problemId,
        isAllTestsSuccessful: false,
        failedTest: 0,
        isCompilationSuccessful: true,
        isUnexpectedError: true,
        status: 0
      } as ResultRunProgram)
    }
  }

}

function problemToInput(problem: FullProblem): ProblemInput {
  return {
    name: problem.name,
    description: problem.description,
    note: problem.note,
    inputTypeId: problem.io.input.id,
    outputTypeId: problem.io.output.id,
    limitTime: problem.limits.time,
    limitMemory: problem.limits.memory,
    publicationDate: problem.publicationDate,
    authorId: problem.author.id,
    testerId: problem.tester && problem.tester.id
  }
}
