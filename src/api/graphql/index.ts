import * as mutations from './mutations'
import * as queries from './queries'
import {mapRequester} from "./utils";

// TODO: add pre-compiling queries when build project

export const login = mapRequester(mutations.login);

export const register = mapRequester(mutations.register);

export const createProblem = mapRequester(mutations.createProblem)
export const updateProblem = mapRequester(mutations.updateProblem)
export const deleteProblem = mapRequester(mutations.deleteProblem)

export const currentUser = mapRequester(queries.currentUser);

export const searchCountries = mapRequester(queries.searchCountries);
export const countries = mapRequester(queries.countries);
export const cities = mapRequester(queries.cities);
export const country = mapRequester(queries.country);
export const city = mapRequester(queries.city);

export const problems = mapRequester(queries.problems)
export const partialProblems = mapRequester(queries.partialProblems)
export const problem = mapRequester(queries.problem)

export const inputOutputTypes = mapRequester(queries.inputOutputTypes)

export const tags = mapRequester(queries.tags)

export const createTest = mapRequester(mutations.createTest)
export const updateTest = mapRequester(mutations.updateTest)
export const deleteTest = mapRequester(mutations.deleteTest)

export const createTag = mapRequester(mutations.createTag)
export const updateTag = mapRequester(mutations.updateTag)
export const deleteTag = mapRequester(mutations.deleteTag)

export const createInputType = mapRequester(mutations.createInputType)
export const updateInputType = mapRequester(mutations.updateInputType)
export const deleteInputType = mapRequester(mutations.deleteInputType)

export const createOutputType = mapRequester(mutations.createOutputType)
export const updateOutputType = mapRequester(mutations.updateOutputType)
export const deleteOutputType = mapRequester(mutations.deleteOutputType)
