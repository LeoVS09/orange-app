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
import problemsActions from './problems'
import testsActions from './tests'
import tagsActions from './tags'

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

// TODO: make solution creating
export interface IUploadCodePayload {
   problemId: string,
   text: string
}

export default {

   ...problemsActions,
   ...testsActions,
   ...tagsActions,

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
   }
}

