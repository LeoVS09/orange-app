import * as actionTypes from "../actionTypes";
import {IActionContext} from "@/store/state";
import {ProblemsState} from "../state";
import {defaultTest, Test, TestStatus} from "@/models";
import {randomId} from "@/components/utils";
import {
   IAddForCreateTestPayload,
   ICreateTestPayload,
   IEditTestPayload,
   ISetTestStatusPayload, IUpdateTestPayload
} from "../mutations";
import * as mutations from "../mutationTypes";
import * as API from "@/api";
import {responseToTest} from "../utils";
import {findTest, toUpdateTestPatch} from "./utils";
import {Commit} from 'vuex'

export interface ICreateTestActionPayload {
   problemId: string
   test: Test
}

export interface IUpdateTestActionPayload {
   problemId: string
   testId: string
}

export default {
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
         input: {
            test: {
               index: test.index,
               input: test.input,
               output: test.output,
               isPublic: test.isPublic
            }
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

   async [actionTypes.UPDATE_TEST]({commit, rootGetters}: IActionContext<ProblemsState>, {problemId, testId}: IUpdateTestActionPayload): Promise<boolean> {
      let test = findTest(rootGetters, problemId, testId)
      if(!test){
         console.error('Cannot find test:', testId)
         return false
      }

      if (!test.input.length || !test.output.length) {
         console.error('Not have input or output for test')
         return false
      }

      setTestStatus(commit, problemId, test.id, TestStatus.Updating)

      const result = await API.updateTest({input:toUpdateTestPatch(test)})
      if (!result) {
         console.error("Cannot update test", test);
         setTestStatus(commit, problemId, test.id, TestStatus.ErrorUpdating)
         return false
      }

      // check if test was changed when updating
      test = findTest(rootGetters, problemId, testId)
      if(!test) {
         console.error('Unexpected error, test was removed when updating')
         return false
      }

      if(test.status === TestStatus.Changed) {
         console.log('Test was changed when updating')
         return true
      }

      const payload: IUpdateTestPayload = {
         problemId,
         test: responseToTest(result)
      }
      commit(mutations.UPDATE_TEST, payload);
      return true
   },
}

function setTestStatus(commit: Commit, problemId: string, testId: string, status: TestStatus) {
   const payload: ISetTestStatusPayload = {
      problemId,
      testId,
      status
   }
   commit(mutations.SET_TEST_STATUS, payload)
}
