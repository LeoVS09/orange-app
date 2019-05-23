import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import countriesGql from './Countries.graphql'
import countryGql from './Country.graphql'
import problemsGql from './problems.graphql'
import partialProblemsGql from './partialProblems.graphql'
import problemGql from './Problem.graphql'
import inputOutputTypesGql from './inputOutputTypes.graphql'
import citiesGql from './cities.graphql'
import cityGql from './city.graphql'
import tagsGql from './tags.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";
import {mockCountries, mockCities, mockCountry} from "@/models/mock/countries";

import * as types from './types'
import {mockTags} from "@/models/mock/mock";

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export const currentUser = generateSimpleQuery<types.CurrentUser, types.CurrentUser_currentUser>(
   currentUserGql,
   data => data.currentUser
)

export const searchCountries = generateQuery<types.SearchCountriesVariables, types.SearchCountries, types.SearchCountries_searchCountries>(
   searchCountriesGql,
   data => data.searchCountries
)

export const countries = generateQuery<types.CountriesVariables, types.Countries, types.Countries_countries>(
   countriesGql,
   data => data.countries,
   () => new Promise<types.Countries_countries>(resolve =>

      setTimeout(() => {
            const nodes = mockCountries()
               .map(c => ({
                  ...c,
                  createdAt: c.createdAt.toDateString(),
                  updatedAt: c.updatedAt.toDateString()
               }))

            // @ts-ignore
            resolve({
               totalCount: nodes.length,
               nodes
            })
         },
         1000
      )
   )
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
                  countryId: id
               }))
            }
         }),
         1000
      ))
)

export const cities = generateQuery<types.CitiesVariables, types.Cities, types.Cities_cities>(
   citiesGql,
   data => data.cities
)


export const city = generateQuery<types.CityVariables, types.City, types.City_city>(
   cityGql,
   data => data.city
)

export const partialProblems = generateQuery<types.PartialProblemsVariables, types.PartialProblems, types.PartialProblems_problems>(
   partialProblemsGql,
   data => data.problems
)

export const problems = generateQuery<types.ProblemsVariables, types.Problems, types.Problems_problems>(
   problemsGql,
   data => data.problems
)

// TODO: mock problem
export const problem = generateQuery<types.ProblemVariables, types.Problem, types.Problem_problem>(
   problemGql,
   data => data.problem
)

export const inputOutputTypes = generateQuery<types.InputOutputTypesVariables, types.InputOutputTypes, {inputs: types.InputOutputTypes_programInputTypes | null, outputs: types.InputOutputTypes_programOutputTypes | null}>(
   inputOutputTypesGql,
   data => ({
      inputs: data.programInputTypes,
      outputs: data.programOutputTypes
   })
)

export const tags = generateQuery<types.TagsVariables, types.Tags, types.Tags_tags>(
   tagsGql,
   data => data.tags,
   () => new Promise(resolve => setTimeout(() => {
      const nodes = mockTags()
      return {
         totalCount: nodes.length,
         nodes
      }
      },
      1000))
)

// TODO: complete typesation for non parametred queries
function generateQuery<V, T, R>(graphql: any, formatter: (result: T) => R | null, mock?: (variables: V) => Promise<R>) {
   if (DEBUG && mock)
      return (client: APIClient) => (variables: V) => mock(variables)

   return (client: APIClient) => (variables: V) =>
      client.query<T>({
         query: gql(graphql),
         variables
      })
         .then(result => result.data && formatter(result.data))
}

function generateSimpleQuery<T, R>(graphql: any, formatter: (result: T) => R | null, mock?: () => Promise<R>) {
   if (DEBUG && mock)
      return (client: APIClient) => () => mock()

   return (client: APIClient) => () =>
      client.query<T>({
         query: gql(graphql)
      })
         .then(result => result.data && formatter(result.data))
}
