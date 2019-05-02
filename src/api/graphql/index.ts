import * as mutations from './mutations'
import * as queries from './queries'
import {mapRequester} from "./utils";

// TODO: add pre-compiling queries when build project

export const login = mapRequester(mutations.login);

export const register = mapRequester(mutations.register);

export const currentUser = mapRequester(queries.currentUser);

export const searchCountries = mapRequester(queries.searchCountries);

export const countries = mapRequester(queries.countries);

export const problems = mapRequester(queries.problems)

export const problem = mapRequester(queries.problem)
