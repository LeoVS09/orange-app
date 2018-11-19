import gql from 'graphql-tag'

import * as queriesGQls from './queries'
import * as mutationsGQLs from './mutations'

// TODO: add precompiling queries when build project

let queries = {...queriesGQls };

Object.keys(queriesGQls).forEach(key => {
  // @ts-ignore
  queries[key] = gql(queriesGQls[key])
});

let mutations = {...mutationsGQLs};

Object.keys(mutationsGQLs).forEach(key => {
  // @ts-ignore
  mutations[key] = gql(mutationsGQLs[key])
});

export {
  queries,
  mutations
}
