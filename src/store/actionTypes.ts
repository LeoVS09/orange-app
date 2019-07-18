// UI
export * from './modules/ui/actionTypes'

// PROFILE
export * from './modules/profile/actionTypes'

// PROBLEMS
export * from './modules/problems/actionTypes'

// COUNTRIES, CITIES, PROBLEMS, TAGS, UNIVERSITIES, CONTESTS, TAGS
export * from './CrudModule/actionTypes'

export enum MODULES {
   COUNTRIES = 'countries',
   CITIES = 'cities',
   PROBLEMS = 'problems',
   CONTESTS = 'contests',
   TAGS = 'tags',
   UNIVERSITIES = 'universities',
}

export const actionName = (module: MODULES, action: string) => `${module}/${action}`
