// UI
export * from './modules/ui/actionTypes'

// PROFILE
export * from './modules/profile/actionTypes'

// PROBLEMS
export * from './modules/problems/actionTypes'

// TAGS
export * from './modules/tags/actionTypes'

// COUNTRIES, CITIES, PROBLEMS, TAGS, UNIVERSITIES
export * from './CrudModule/actionTypes'

export enum MODULES {
   COUNTRIES = 'countries',
   CITIES = 'cities',
   PROBLEMS = 'problems',
   TAGS = 'tags',
   UNIVERSITIES = 'universities'
}

export const actionName = (module: MODULES, action: string) => `${module}/${action}`
