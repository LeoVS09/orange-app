import { generateMutation } from '@/api/database/utils'
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

import createCountryGql from './createCountry.graphql'
import updateCountryGql from './updateCountry.graphql'
import deleteCountryGql from './deleteCountry.graphql'

import createCityGql from './createCity.graphql'
import updateCityGql from './updateCity.graphql'
import deleteCityGql from './deleteCity.graphql'

import createUniversityGql from './createUniversity.graphql'
import updateUniversityGql from './updateUniversity.graphql'
import deleteUniversityGql from './deleteUniversity.graphql'

import createContestGql from './createContest.graphql'
import updateContestGql from './updateContest.graphql'
import deleteContestGql from './deleteContest.graphql'

import * as types from './types'

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

// --------------------------------------------- OutputType ------------------------------------------------------------

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

// ------------------------------------------------ Country ------------------------------------------------------------

export const createCountry = generateMutation<types.createCountryVariables, types.createCountry, types.createCountry_createCountry_country>(
  createCountryGql,
  result => result.createCountry && result.createCountry.country
)

export const updateCountry = generateMutation<types.updateCountryVariables, types.updateCountry, types.updateCountry_updateCountry_country>(
  updateCountryGql,
  result => result.updateCountry && result.updateCountry.country
)

export const deleteCountry = generateMutation<types.deleteCountryVariables, types.deleteCountry, types.deleteCountry_deleteCountry_country>(
  deleteCountryGql,
  result => result.deleteCountry && result.deleteCountry.country
)

// -------------------------------------------------- City -------------------------------------------------------------

export const createCity = generateMutation<types.createCityVariables, types.createCity, types.createCity_createCity_city>(
  createCityGql,
  result => result.createCity && result.createCity.city
)

export const updateCity = generateMutation<types.updateCityVariables, types.updateCity, types.updateCity_updateCity_city>(
  updateCityGql,
  result => result.updateCity && result.updateCity.city
)

export const deleteCity = generateMutation<types.deleteCityVariables, types.deleteCity, types.deleteCity_deleteCity_city>(
  deleteCityGql,
  result => result.deleteCity && result.deleteCity.city
)

// ----------------------------------------------- University ----------------------------------------------------------

export const createUniversity = generateMutation<types.createUniversityVariables, types.createUniversity, types.createUniversity_createUniversity_university>(
  createUniversityGql,
  result => result.createUniversity && result.createUniversity.university
)

export const updateUniversity = generateMutation<types.updateUniversityVariables, types.updateUniversity, types.updateUniversity_updateUniversity_university>(
  updateUniversityGql,
  result => result.updateUniversity && result.updateUniversity.university
)

export const deleteUnviersity = generateMutation<types.deleteUniversityVariables, types.deleteUniversity, types.deleteUniversity_deleteUniversity_university>(
  deleteUniversityGql,
  result => result.deleteUniversity && result.deleteUniversity.university
)

// ------------------------------------------------- Contest -----------------------------------------------------------

export const createContest = generateMutation<types.createContestVariables, types.createContest, types.createContest_createContest_contest>(
  createContestGql,
  result => result.createContest && result.createContest.contest
)

export const updateContest = generateMutation<types.updateContestVariables, types.updateContest, types.updateContest_updateContest_contest>(
  updateContestGql,
  result => result.updateContest && result.updateContest.contest
)

export const deleteContest = generateMutation<types.deleteContestVariables, types.deleteContest, types.deleteContest_deleteContest_contest>(
  deleteContestGql,
  result => result.deleteContest && result.deleteContest.contest
)
