import * as API from "@/api";
import {defaultProblem, defaultTest, FullProblem, PartialProblem, ResultRunProgram, Test} from "@/models";
import {IActionContext, RootGetters} from '@/store/state'
import {ProblemFilter, ProblemsState} from '../state'
import * as mutations from '../mutationTypes'
import * as actionTypes from '../actionTypes'
import {IStartTestingSolutionPayload} from "../mutations";
import {
   addModelForCreateAction,
   createAction,
   crudActions,
   deleteAction,
   editAction,
   updateAction
} from "@/store/CrudModule";
import {ProblemInput, ProblemsOrderBy} from "@/api/graphql/global-types";
import {responseToFullProblem, responseToPartialProblem} from "@/store/modules/problems/actions/responseFormat";
import {STATUS_SCOPES} from "@/store/statusScopes";

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

// TODO: make solution creating
export interface IUploadCodePayload {
   problemId: string,
   text: string
}

export {
   IAddForCreateTestActionPayload,
   IDeleteTestActionPayload,
   IUpdateTestActionPayload
} from './tests'

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

         read: async id => responseToFullProblem(await API.problem({id})),

         create: async (problem: FullProblem) => responseToFullProblem(
            await API.createProblem({
               input: {
                  problem: problemToInput(problem)
               }
            })),

         update: async (problem: FullProblem) => responseToFullProblem(
            await API.updateProblem({
               input: {
                  id: problem.id,
                  patch: problemToInput(problem)
               }
            })
         ),

         delete: async id => responseToPartialProblem(
            await API.deleteProblem({input: {id}})
         )
      }
   ),

   async [actionTypes.UPLOAD_CODE]({commit}: IActionContext<ProblemsState>, {problemId, text}: IUploadCodePayload) {
      const payload: IStartTestingSolutionPayload = {problemId}
      commit(mutations.START_TESTING_SOLUTION, payload)

      try {
         const result = await API.runProgram(problemId, text)

         commit(mutations.SET_RESULT_OF_SOLUTION_RUN, result)
      } catch (e) {
         console.error("Error upload code:", e)

         commit(mutations.SET_RESULT_OF_SOLUTION_RUN, {
            problemId,
            isAllTestsSuccessful: false,
            failedTest: 0,
            isCompilationSuccessful: true,
            isUnexpectedError: true,
            status: 0
         } as ResultRunProgram)
      }
   },

   [actionTypes.SET_PROBLEMS_FILTER]({commit}: IActionContext<ProblemsState>, filter: ProblemFilter) {
      commit(mutations.SET_PROBLEMS_FILTER, filter)
   },


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
