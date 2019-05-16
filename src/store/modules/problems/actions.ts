import * as API from "@/api";
import {responseToFullProblem, responseToPartialProblem, responseToTest} from "./utils";
import {
   defaultProblem,
   defaultTest,
   FullProblem,
   PartialProblem,
   ProblemStatus,
   ResultRunProgram,
   Test,
   TestStatus
} from "@/models";
import {IActionContext} from '@/store/state'
import {ProblemsState} from './state'
import * as mutations from './mutationTypes'
import * as actionTypes from './actionTypes'
import * as mock from "@/store/plugins/mock/generator";
import {
   IAddForCreateTestPayload, ICreateProblemPayload,
   ICreateTestPayload,
   IEditTestPayload,
   ISetProblemStatusPayload,
   ISetTestStatusPayload,
   IStartTestingSolutionPayload,
   IUpdateTestPayload
} from "./mutations";
import {randomId} from "@/components/utils";

export function mockProblems({commit}: IActionContext<ProblemsState>) {
   let count = 10;
   let add = () => {
      setTimeout(() => {
         commit(mutations.ADD_FULL_READ_PROBLEM, {...mock.createProblem(), isOpen: true});
         if (count-- > 0) {
            add();
         }
      }, 100)
   };
   add();
}

export interface ICreateTestActionPayload {
   problemId: string
   test: Test
}

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export default {
   async [actionTypes.READ_PROBLEMS_LIST](context: IActionContext<ProblemsState>) {
      const {state, commit} = context

      if (DEBUG) {
         mockProblems(context);
         return
      }

      const problems = await API.partialProblems()
      if (!problems)
         return console.error('Not found problems')

      problems.forEach(p => {
         const wasHave = state.data.find(inState => inState.id === p.id)

         if (!wasHave)
            return commit(mutations.ADD_PARTIAL_READ_PROBLEM, responseToPartialProblem(p))

         if (p.updatedAt <= wasHave.updatedAt)
            return

         commit(mutations.UPDATE_PROBLEM, responseToPartialProblem(p))
      })

   },

   [actionTypes.EDIT_PROBLEM]({commit}: IActionContext<ProblemsState>, problem: FullProblem) {
      commit(mutations.EDIT_PROBLEM, problem);
   },

   async [actionTypes.UPDATE_PROBLEM]({commit, rootGetters}: IActionContext<ProblemsState>, id: string) {
      const problem = rootGetters.problems.find(p => p.id === id)
      if (!problem)
         return console.error('Not have problem for update:', id)

      const startPayload: ISetProblemStatusPayload = {
         problemId: id,
         status: ProblemStatus.Updating
      }
      commit(mutations.SET_PROBLEM_STATUS, startPayload)

      const result = await API.updateProblem(toUpdateProblem(problem))

      if (!result) {
         console.error('Error when update problem', problem)
         const errorPayload: ISetProblemStatusPayload = {
            problemId: id,
            status: ProblemStatus.ErrorUpdating
         }
         commit(mutations.SET_PROBLEM_STATUS, errorPayload)
         return
      }

      commit(mutations.UPDATE_PROBLEM, {
         ...responseToFullProblem(result)
      } as FullProblem);

   },

   async [actionTypes.READ_PROBLEM]({commit, getters}: IActionContext<ProblemsState>, problemId: string): Promise<FullProblem | void> {
      const startPayload: ISetProblemStatusPayload = {
         problemId,
         status: ProblemStatus.Reading
      }
      commit(mutations.SET_PROBLEM_STATUS, startPayload)

      const result = await API.problem(problemId)

      if (!result) {
         console.error('Cannot load problem', problemId)
         const errorPayload: ISetProblemStatusPayload = {
            problemId,
            status: ProblemStatus.ErrorReading
         }
         commit(mutations.SET_PROBLEM_STATUS, errorPayload)
         return
      }

      const problem = responseToFullProblem(result)

      if (getters.problems.find((p: PartialProblem) => p.id === problemId))
         commit(mutations.UPDATE_PROBLEM, problem)
      else
         commit(mutations.ADD_FULL_READ_PROBLEM, problem)

      return problem
   },

   [actionTypes.SETUP_PROBLEMS]({commit}: IActionContext<ProblemsState>, problems: Array<FullProblem>) {
      commit(mutations.SET_PROBLEMS, problems);
   },

   [actionTypes.ADD_FULL_READ_PROBLEM]({commit}: IActionContext<ProblemsState>, problem: FullProblem) {
      commit(mutations.ADD_FULL_READ_PROBLEM, problem);
   },

   async [actionTypes.UPLOAD_CODE]({commit}: IActionContext<ProblemsState>, {id, text}: { id: string, text: string }) {
      const payload: IStartTestingSolutionPayload = {problemId: id}
      commit(mutations.START_TESTING_SOLUTION, payload)

      try {
         const result = await API.runProgram(id, text)

         commit(mutations.SET_RESULT_OF_SOLUTION_RUN, result)
      } catch (e) {
         console.error("Error upload code:", e)

         commit(mutations.SET_RESULT_OF_SOLUTION_RUN, {
            problemId: id,
            isAllTestsSuccessful: false,
            failedTest: 0,
            isCompilationSuccessful: true,
            isUnexpectedError: true,
            status: 0
         } as ResultRunProgram)
      }
   },

   [actionTypes.ADD_FOR_CREATE_TEST]({commit}: IActionContext<ProblemsState>, problemId: string): Test {
      const test: Test = {
         ...defaultTest(),
         id: randomId(),
      }
      const payload: IAddForCreateTestPayload = {
         problemId,
         test
      }
      commit(mutations.ADD_TEST_FOR_CREATE, payload)

      return test
   },

   async [actionTypes.CREATE_TEST]({commit}: IActionContext<ProblemsState>, {problemId, test}: ICreateTestActionPayload) {
      const startPayload: ISetTestStatusPayload = {
         problemId,
         testId: test.id,
         status: TestStatus.Creating
      }
      commit(mutations.SET_TEST_STATUS, startPayload)

      const result = await API.createTest({
         test: {
            index: test.index,
            input: test.input,
            output: test.output,
            isPublic: test.isPublic
         }
      })

      if(!result) {
         console.error('Cannot create test', test)
         const errorPayload: ISetTestStatusPayload = {
            problemId,
            testId: test.id,
            status: TestStatus.ErrorCreating
         }
         commit(mutations.SET_TEST_STATUS, errorPayload)
         return
      }

      const endPayload: ICreateTestPayload = {
         problemId,
         oldTestId: test.id,
         test: responseToTest(result)
      }
      commit(mutations.CREATE_TEST, endPayload)
   },

   [actionTypes.EDIT_TEST]({commit}: IActionContext<ProblemsState>, payload: IEditTestPayload) {
      commit(mutations.EDIT_TEST, payload);
   },

   async [actionTypes.UPDATE_TEST]({commit}: IActionContext<ProblemsState>, {problemId, test}: IUpdateTestPayload): Promise<boolean> {
      if (!test.input.length || !test.output.length) {
         return false
      }

      const startPayload: ISetTestStatusPayload = {
         problemId,
         testId: test.id,
         status: TestStatus.Updating
      }
      commit(mutations.SET_TEST_STATUS, startPayload)

      const result = await API.updateTest(toUpdateTestPatch(test))

      if (!result) {
         console.error("Cannot update test", test);
         const errorPayload: ISetTestStatusPayload = {
            problemId,
            testId: test.id,
            status: TestStatus.ErrorUpdating
         }
         commit(mutations.SET_TEST_STATUS, errorPayload)
         return false
      }

      const payload: IUpdateTestPayload = {
         problemId,
         test: responseToTest(result)
      }
      commit(mutations.UPDATE_TEST, payload);
      return true
   },

   [actionTypes.ADD_FOR_CREATE_PROBLEM]({commit, dispatch}: IActionContext<ProblemsState>): FullProblem {
      const problem: FullProblem = {
         ...defaultProblem(),
         id: randomId()
      }
      commit(mutations.ADD_PROBLEM_FOR_CREATE, problem);

      dispatch(actionTypes.ADD_FOR_CREATE_TEST, problem.id);

      return problem
   },

   async [actionTypes.CREATE_PROBLEM]({commit, state, rootState}: IActionContext<ProblemsState>, problem: FullProblem): Promise<FullProblem | undefined> {

      if(!rootState.profile.data){
         console.error("Cannot create problem when not sign in")
         return
      }

      const startPayload: ISetProblemStatusPayload = {
         problemId: problem.id,
         status: ProblemStatus.Creating
      }
      commit(mutations.SET_PROBLEM_STATUS, startPayload)

      const result = await API.createProblem({
         problem: {
            name: problem.name,
            description: problem.description,
            note: problem.note,
            inputTypeId: problem.io.input.id,
            outputTypeId: problem.io.output.id,
            limitTime: problem.limits.time,
            limitMemory: problem.limits.memory,
            publicationDate: problem.publicationDate,
            authorId: rootState.profile.data.id
         }
      })

      if(!result) {
         console.error('Cannot create problem', problem)
         const errorPayload: ISetProblemStatusPayload = {
            problemId: problem.id,
            status: ProblemStatus.ErrorCreating
         }
         commit(mutations.SET_PROBLEM_STATUS, errorPayload)
         return
      }

      const endPayload: ICreateProblemPayload = {
         oldProblemId: problem.id,
         problem: responseToFullProblem(result)
      }
      commit(mutations.CREATE_PROBLEM, endPayload)

      return endPayload.problem
   }
}

function toUpdateProblem(problem: FullProblem) {
   return {
      id: problem.id,
      patch: {
         name: problem.name,
         description: problem.description,
         note: problem.note,
         inputTypeId: problem.io.input.id,
         outputTypeId: problem.io.output.id,
         limitTime: problem.limits.time,
         limitMemory: problem.limits.memory,
         publicationDate: problem.publicationDate,
         testerId: problem.tester.id
      }
   }
}

function toUpdateTestPatch(test: Test) {
   return {
      id: test.id,
      patch: {
         index: test.index,
         input: test.input,
         output: test.output,
         isPublic: test.isPublic
      }
   }
}
