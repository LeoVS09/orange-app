import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import countriesGql from './countries.graphql'
import countryGql from './country.graphql'
import problemsGql from './problems.graphql'
import problemGql from './problem.graphql'
import inputOutputTypesGql from './inputOutputTypes.graphql'
import citiesGql from './cities.graphql'
import cityGql from './city.graphql'
import tagsGql from './tags.graphql'
import tagGql from './tag.graphql'
import universityGql from './university.graphql'
import universitiesGql from './universities.graphql'
import codeEditorGql from './codeEditor.graphql'
import codeEditorsGql from './codeEditors.graphql'
import compilerGql from './compiler.graphql'
import compilersGql from './compilers.graphql'
import contestGql from './contest.graphql'
import contestsGql from './contests.graphql'
import profileGql from './profile.graphql'
import profilesGql from './profiles.graphql'
import programmingLanguageGql from './programmingLanguage.graphql'
import programmingLanguagesGql from './programmingLanguages.graphql'
import teamGql from './team.graphql'
import teamsGql from './teams.graphql'
import { mockCountries, mockCities, mockCountry } from '@/models/mock/countries'
import * as types from './types'
import { mockTags } from '@/models/mock/mock'
import { generateQuery, generateSimpleQuery } from '@/api/database/utils'

export const currentUser = generateSimpleQuery<types.CurrentUser, types.CurrentUser_currentUser>(
  currentUserGql,
  data => data.currentUser,
)

// ------------------------------------------------ Country ------------------------------------------------------------

export const searchCountries = generateQuery<types.SearchCountriesVariables, types.SearchCountries, types.SearchCountries_searchCountries>(
  searchCountriesGql,
  data => data.searchCountries,
)

export const countries = generateQuery<types.CountriesVariables, types.Countries, types.Countries_countries>(
  countriesGql,
  data => data.countries,
  () => new Promise<types.Countries_countries>(resolve => setTimeout(() => {
    const nodes = mockCountries()
      .map(c => ({
        ...c,
        createdAt: c.createdAt.toDateString(),
        updatedAt: c.updatedAt.toDateString(),
      }))

    // @ts-ignore
    resolve({
      totalCount: nodes.length,
      nodes,
    })
  },
  1000)),
)

export const country = generateQuery<types.CountryVariables, types.Country, types.Country_country>(
  countryGql,
  data => data.country,
  id => new Promise<types.Country_country>(resolve =>
  // @ts-ignore
    setTimeout(() => resolve({
      ...mockCountry(),
      id,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      cities: {
        nodes: mockCities().map(c => ({
          ...c,
          createdAt: c.createdAt.toDateString(),
          updatedAt: c.updatedAt.toDateString(),
          countryId: id,
        })),
      },
    }),
    1000)),
)

// -------------------------------------------------- City -------------------------------------------------------------

export const cities = generateQuery<types.CitiesVariables, types.Cities, types.Cities_cities>(
  citiesGql,
  data => data.cities,
)

export const city = generateQuery<types.CityVariables, types.City, types.City_city>(
  cityGql,
  data => data.city,
)

// ----------------------------------------------- University ----------------------------------------------------------

export const universities = generateQuery<types.UniversitiesVariables, types.Universities, types.Universities_universities>(
  universitiesGql,
  data => data.universities,
)

export const university = generateQuery<types.UniversityVariables, types.University, types.University_university>(
  universityGql,
  data => data.university,
)

// ----------------------------------------------- Problem -------------------------------------------------------------

export const problems = generateQuery<types.ProblemsVariables, types.Problems, types.Problems_problems>(
  problemsGql,
  data => data.problems,
)

// TODO: mock problem
export const problem = generateQuery<types.ProblemVariables, types.Problem, types.Problem_problem>(
  problemGql,
  data => data.problem,
)

// -------------------------------------------- inputOutputType --------------------------------------------------------

export const inputOutputTypes = generateQuery<types.InputOutputTypesVariables, types.InputOutputTypes, { inputs: types.InputOutputTypes_programInputTypes | null, outputs: types.InputOutputTypes_programOutputTypes | null}>(
  inputOutputTypesGql,
  data => ({
    inputs: data.programInputTypes,
    outputs: data.programOutputTypes,
  }),
)

// ------------------------------------------------ Tag ----------------------------------------------------------------

export const tags = generateQuery<types.TagsVariables, types.Tags, types.Tags_tags>(
  tagsGql,
  data => data.tags,
  () => new Promise(resolve => setTimeout(() => {
    const nodes = mockTags()
    return {
      totalCount: nodes.length,
      nodes,
    }
  },
  1000)),
)

export const tag = generateQuery<types.TagVariables, types.Tag, types.Tag_tag>(
  tagGql,
  data => data.tag,
)

// ------------------------------------------------ CodeEditor ---------------------------------------------------------

export const codeEditor = generateQuery<types.CodeEditorVariables, types.CodeEditor, types.CodeEditor_codeEditor>(
  codeEditorGql,
  data => data.codeEditor,
)

export const codeEditors = generateQuery<types.CodeEditorsVariables, types.CodeEditors, types.CodeEditors_codeEditors>(
  codeEditorsGql,
  data => data.codeEditors,
)

// ------------------------------------------------ Compiler -----------------------------------------------------------

export const compiler = generateQuery<types.CompilerVariables, types.Compiler, types.Compiler_translator>(
  compilerGql,
  data => data.translator,
)

export const compilers = generateQuery<types.CompilersVariables, types.Compilers, types.Compilers_translators>(
  compilersGql,
  data => data.translators,
)

// ------------------------------------------------ Profile ------------------------------------------------------------

export const profile = generateQuery<types.ProfileVariables, types.Profile, types.Profile_profile>(
  profileGql,
  data => data.profile,
)

export const profiles = generateQuery<types.ProfilesVariables, types.Profiles, types.Profiles_profiles>(
  profilesGql,
  data => data.profiles,
)

// ------------------------------------------ ProgrammingLanguage ------------------------------------------------------

export const programmingLanguage = generateQuery<types.ProgrammingLanguageVariables, types.ProgrammingLanguage, types.ProgrammingLanguage_programmingLanguage>(
  programmingLanguageGql,
  data => data.programmingLanguage,
)

export const programmingLanguages = generateQuery<types.ProgrammingLanguagesVariables, types.ProgrammingLanguages, types.ProgrammingLanguages_programmingLanguages>(
  programmingLanguagesGql,
  data => data.programmingLanguages,
)

// --------------------------------------------------- Team ------------------------------------------------------------

export const team = generateQuery<types.TeamVariables, types.Team, types.Team_team>(
  teamGql,
  data => data.team,
)

export const teams = generateQuery<types.TeamsVariables, types.Teams, types.Teams_teams>(
  teamsGql,
  data => data.teams,
)

// ------------------------------------------------- Contest -----------------------------------------------------------

export const contest = generateQuery<types.ContestVariables, types.Contest, types.Contest_contest>(
  contestGql,
  data => data.contest,
)

export const contests = generateQuery<types.ContestsVariables, types.Contests, types.Contests_contests>(
  contestsGql,
  data => data.contests,
)
