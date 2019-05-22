import loginGql from './login.graphql'
import registerGql from './register.graphql'

import createProblemGql from './createProblem.graphql'
import updateProblemGql from './updateProblem.graphql'
import deleteProblemGql from './deleteProblem.graphql'

import createTestGql from './createTest.graphql'
import updateTestGql from './updateTest.graphql'
import deleteTestGql from './deleteTest.graphql'

import createTagGql from './createTag.graphql'
import updateTagGql from './updateTag.graphql'
import deleteTagGql from './deleteTag.graphql'

import createInputTypeGql from './createInputType.graphql'
import updateInputTypeGql from './updateInputType.graphql'
import deleteInputTypeGql from './deleteInputType.graphql'

import createOutputTypeGql from './createOutputType.graphql'
import updateOutputTypeGql from './updateOutputType.graphql'
import deleteOutputTypeGql from './deleteOutputType.graphql'

import gql from 'graphql-tag'
import {APIClient} from "../apollo";
import {
   ResponseLogin,
   ResponseRegister,
   RequestRegisterInput,
   RequestLoginInput,
   RequestUpdateProblemInput,
   ResponseUpdateProblem,
   RequestCreateProblemInput,
   ResponseCreateProblem,
   RequestDeleteProblemInput,
   ResponseDeleteProblem,
   RequestCreateTestInput,
   ResponseCreateTest,
   RequestUpdateTestInput,
   ResponseUpdateTest,
   RequestDeleteTestInput,
   ResponseDeleteTest,
   ResponseCreateTag,
   RequestCreateTagInput,
   RequestUpdateTagInput,
   ResponseUpdateTag,
   RequestDeleteTagInput,
   ResponseDeleteTag,
   ResponseUpdateInputType,
   ResponseCreateInputType,
   ResponseDeleteInputType,
   RequestCreateInputTypeInput,
   RequestUpdateInputTypeInput,
   RequestDeleteInputTypeInput,
   ResponseUpdateOutputType,
   RequestUpdateOutputTypeInput,
   ResponseCreateOutputType,
   RequestCreateOutputTypeInput,
   RequestDeleteOutputTypeInput,
   ResponseDeleteOutputType
} from "./types";
import {
   ResponseDataInputOutputType,
   ResponseDataProblem,
   ResponseDataTag,
   ResponseDataTest,
   ResponseDataUser
} from "../fragments/types";

// ------------------------------------------------ Auth ---------------------------------------------------------------

export const login = generateMutation<RequestLoginInput, ResponseLogin, ResponseDataUser>(
   loginGql,
      result => result.login.user
)

export const register = generateMutation<RequestRegisterInput, ResponseRegister, ResponseDataUser>(
   registerGql,
   result => result.register.user
)

// ----------------------------------------------- Problem -------------------------------------------------------------

export const createProblem = generateMutation<RequestCreateProblemInput, ResponseCreateProblem, ResponseDataProblem>(
   createProblemGql,
   result => result.createProblem.problem
)

export const updateProblem = generateMutation<RequestUpdateProblemInput, ResponseUpdateProblem, ResponseDataProblem>(
   updateProblemGql,
   result => result.updateProblem.problem
)

export const deleteProblem = generateMutation<RequestDeleteProblemInput, ResponseDeleteProblem, ResponseDataProblem>(
   deleteProblemGql,
   result => result.deleteProblem.problem
)

// ------------------------------------------------ Test ---------------------------------------------------------------

export const createTest = generateMutation<RequestCreateTestInput, ResponseCreateTest, ResponseDataTest>(
   createTestGql,
   result => result.createTest.test
)

export const updateTest = generateMutation<RequestUpdateTestInput, ResponseUpdateTest, ResponseDataTest>(
   updateTestGql,
   result => result.updateTest.test
)

export const deleteTest = generateMutation<RequestDeleteTestInput, ResponseDeleteTest, ResponseDataTest>(
   deleteTestGql,
   result => result.deleteTest.test
)

// ------------------------------------------------ Tag ----------------------------------------------------------------

export const createTag = generateMutation<RequestCreateTagInput, ResponseCreateTag, ResponseDataTag>(
   createTagGql,
   result => result.createTag.tag
)

export const updateTag = generateMutation<RequestUpdateTagInput, ResponseUpdateTag, ResponseDataTag>(
   updateTagGql,
   result => result.updateTag.tag
)

export const deleteTag = generateMutation<RequestDeleteTagInput, ResponseDeleteTag, ResponseDataTag>(
   deleteTagGql,
   result => result.deleteTag.tag
)

// --------------------------------------------- InputType -------------------------------------------------------------

export const createInputType = generateMutation<RequestCreateInputTypeInput, ResponseCreateInputType, ResponseDataInputOutputType>(
   createInputTypeGql,
   result => result.createProgramInputType.programInputType
)

export const updateInputType = generateMutation<RequestUpdateInputTypeInput, ResponseUpdateInputType, ResponseDataInputOutputType>(
   updateInputTypeGql,
   result => result.updateProgramInputType.programInputType
)

export const deleteInputType = generateMutation<RequestDeleteInputTypeInput, ResponseDeleteInputType, ResponseDataInputOutputType>(
   deleteInputTypeGql,
   result => result.deleteProgramInputType.programInputType
)

// --------------------------------------------- OutputType -------------------------------------------------------------

export const createOutputType = generateMutation<RequestCreateOutputTypeInput, ResponseCreateOutputType, ResponseDataInputOutputType>(
   createOutputTypeGql,
   result => result.createProgramOutputType.programOutputType
)

export const updateOutputType = generateMutation<RequestUpdateOutputTypeInput, ResponseUpdateOutputType, ResponseDataInputOutputType>(
   updateOutputTypeGql,
   result => result.updateProgramOutputType.programOutputType
)

export const deleteOutputType = generateMutation<RequestDeleteOutputTypeInput, ResponseDeleteOutputType, ResponseDataInputOutputType>(
   deleteOutputTypeGql,
   result => result.deleteProgramOutputType.programOutputType
)



function generateMutation<V, T, R>(graphql: any, formatter: (result: T) => R) {
   return (client: APIClient) => (variables: V) =>
      client.mutate<T>({
         mutation: gql(graphql),
         variables
      })
         .then(result => result.data && formatter(result.data))
}
