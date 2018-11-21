import * as mutations from './mutations'
import * as queries from './queries'
import { makeClient} from "./apollo";
import urls from '../urls.json'

const client = makeClient(urls.DATABASE_SERVER);

// TODO: add pre-compiling queries when build project
// TODO: add uto client insert

export const login = mutations.login(client);

export const currentUser = queries.currentUser(client);
