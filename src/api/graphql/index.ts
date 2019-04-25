import * as mutations from './mutations'
import * as queries from './queries'
import { makeClient, APIClient} from "./apollo";
import urls from '../urls.json'

const client = makeClient(urls.DATABASE_SERVER);

// TODO: add pre-compiling queries when build project

export const login = mutations.login(client);

export const currentUser = queries.currentUser(client);

export const searchCountries = queries.searchCountries(client);

export const allCountries = queries.allCountries(client);

export const allProblems = queries.allProblems(client)

export const getProblem = queries.getProblem(client)
