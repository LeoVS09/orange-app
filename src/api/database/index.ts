export * from './mutations'
export * from './queries'

import * as globalTypes from './global-types'
import * as queriesTypes from './queries/types'
import * as mutationsTypes from './mutations/types'

export const types = {
   globalTypes,
   queriesTypes,
   mutationsTypes,
}

// TODO: add pre-compiling queries when build project
