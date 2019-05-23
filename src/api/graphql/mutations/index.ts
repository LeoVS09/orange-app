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
import * as types from "./types";

// ------------------------------------------------ Auth ---------------------------------------------------------------

export const login = generateMutation<types.LoginVariables, types.Login, types.Login_login_user>(
   loginGql,
   result => result.login && result.login.user
)

export const register = generateMutation<types.RegisterVariables, types.Register, types.Register_register_user>(
   registerGql,
   result => result.register && result.register.user
)

// ----------------------------------------------- Problem -------------------------------------------------------------

export const createProblem = generateMutation<types.createProblemVariables, types.createProblem, types.createProblem_createProblem_problem>(
   createProblemGql,
   result => result.createProblem && result.createProblem.problem
)

export const updateProblem = generateMutation<types.updateProblemVariables, types.updateProblem, types.updateProblem_updateProblem_problem>(
   updateProblemGql,
   result => result.updateProblem && result.updateProblem.problem
)

export const deleteProblem = generateMutation<types.deleteProblemVariables, types.deleteProblem, types.deleteProblem_deleteProblem_problem>(
   deleteProblemGql,
   result => result.deleteProblem && result.deleteProblem.problem
)

// ------------------------------------------------ Test ---------------------------------------------------------------

export const createTest = generateMutation<types.createTestVariables, types.createTest, types.createTest_createTest_test>(
   createTestGql,
   result => result.createTest && result.createTest.test
)

export const updateTest = generateMutation<types.updateTestVariables, types.updateTest, types.updateTest_updateTest_test>(
   updateTestGql,
   result => result.updateTest && result.updateTest.test
)

export const deleteTest = generateMutation<types.deleteTestVariables, types.deleteTest, types.deleteTest_deleteTest_test>(
   deleteTestGql,
   result => result.deleteTest && result.deleteTest.test
)

// ------------------------------------------------ Tag ----------------------------------------------------------------

export const createTag = generateMutation<types.createTagVariables, types.createTag, types.createTag_createTag_tag>(
   createTagGql,
   result => result.createTag && result.createTag.tag
)

export const updateTag = generateMutation<types.updateTagVariables, types.updateTag, types.updateTag_updateTag_tag>(
   updateTagGql,
   result => result.updateTag && result.updateTag.tag
)

export const deleteTag = generateMutation<types.deleteTagVariables, types.deleteTag, types.deleteTag_deleteTag_tag>(
   deleteTagGql,
   result => result.deleteTag && result.deleteTag.tag
)

// --------------------------------------------- InputType -------------------------------------------------------------

export const createInputType = generateMutation<types.createInputTypeVariables, types.createInputType, types.createInputType_createProgramInputType_programInputType>(
   createInputTypeGql,
   result => result.createProgramInputType && result.createProgramInputType.programInputType
)

export const updateInputType = generateMutation<types.updateInputTypeVariables, types.updateInputType, types.updateInputType_updateProgramInputType_programInputType>(
   updateInputTypeGql,
   result => result.updateProgramInputType && result.updateProgramInputType.programInputType
)

export const deleteInputType = generateMutation<types.deleteInputTypeVariables, types.deleteInputType, types.deleteInputType_deleteProgramInputType_programInputType>(
   deleteInputTypeGql,
   result => result.deleteProgramInputType && result.deleteProgramInputType.programInputType
)

// --------------------------------------------- OutputType -------------------------------------------------------------

export const createOutputType = generateMutation<types.createOutputTypeVariables, types.createOutputType, types.createOutputType_createProgramOutputType_programOutputType>(
   createOutputTypeGql,
   result => result.createProgramOutputType && result.createProgramOutputType.programOutputType
)

export const updateOutputType = generateMutation<types.updateOutputTypeVariables, types.updateOutputType, types.updateOutputType_updateProgramOutputType_programOutputType>(
   updateOutputTypeGql,
   result => result.updateProgramOutputType && result.updateProgramOutputType.programOutputType
)

export const deleteOutputType = generateMutation<types.deleteOutputTypeVariables, types.deleteOutputType, types.deleteOutputType_deleteProgramOutputType_programOutputType>(
   deleteOutputTypeGql,
   result => result.deleteProgramOutputType && result.deleteProgramOutputType.programOutputType
)


function generateMutation<V, T, R>(graphql: any, formatter: (result: T) => R | null) {
   return (client: APIClient) => (variables: V) =>
      client.mutate<T>({
         mutation: gql(graphql),
         variables
      })
         .then(result => result.data && formatter(result.data))
}
