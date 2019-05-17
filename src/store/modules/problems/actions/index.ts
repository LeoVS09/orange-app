import * as API from "@/api";
import {
   ResultRunProgram
} from "@/models";
import {IActionContext} from '@/store/state'
import {ProblemsState} from '../state'
import * as mutations from '../mutationTypes'
import * as actionTypes from '../actionTypes'
import {
   IStartTestingSolutionPayload
} from "../mutations";
import problemActions from './problem'
import testActions from './test'

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export default {

   ...problemActions,
   ...testActions,

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
   }
}

