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
import {
   ResponseCities,
   ResponseCity,
   ResponseCountries,
   ResponseCountry,
   ResponseCurrentUser,
   ResponseInputOutputTypes,
   ResponsePartialProblemsList,
   ResponseProblem,
   ResponseProblemsList,
   ResponseSearchCountries,
   ResponseTags
} from "./types";
import {mockTags} from "@/models/problems";
import {mockCountries, mockCities, mockCountry} from "@/models/mock/countries";
import {ResponseDataFullCountry, ResponseDataPartialCountry} from "@/api/graphql/fragments/types";

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export const currentUser = (client: APIClient) => () =>
   client.query<ResponseCurrentUser>({
      query: gql(currentUserGql)
   })
      .then(result => result.data && result.data.currentUser)


export const searchCountries = (client: APIClient) => (name: string) =>
   client.query<ResponseSearchCountries>({
      query: gql(searchCountriesGql),
      variables: {
         name
      }
   })
      .then(result => result.data && result.data.searchCountries.nodes)

export const countries = (client: APIClient) => () => {
   if(DEBUG)
      return new Promise<Array<ResponseDataPartialCountry>>(resolve =>
         // @ts-ignore
         setTimeout(() => resolve(mockCountries()
               .map(c => ({
               ...c,
               createdAt: c.createdAt.toDateString(),
               updatedAt: c.updatedAt.toDateString()
            }))),
            1000
         )
      )

   return client.query<ResponseCountries>({
      query: gql(countriesGql)
   })
      .then(result => result.data && result.data.countries.nodes)
}

export const country = (client: APIClient) => (id: string) => {
   if(DEBUG)
      return new Promise<ResponseDataFullCountry>(resolve =>
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

   return client.query<ResponseCountry>({
      query: gql(countryGql),
      variables: {
         id
      }
   })
      .then(result => result.data && result.data.country)
}

export const cities = (client: APIClient) => () => {
   return client.query<ResponseCities>({
      query: gql(citiesGql)
   })
      .then(result => result.data && result.data.cities.nodes)
}

export const city = (client: APIClient) => (id: string) => {
   return client.query<ResponseCity>({
      query: gql(cityGql)
   })
      .then(result => result.data && result.data.city)
}

export const partialProblems = (client: APIClient) => () =>
   client.query<ResponsePartialProblemsList>({
      query: gql(partialProblemsGql)
   })
      .then(result => result.data && result.data.problems)
      .then(result => {
         return result && result.nodes
      })

export const problems = (client: APIClient) => () =>
   client.query<ResponseProblemsList>({
      query: gql(problemsGql)
   })
      .then(result => result.data && result.data.problems)
      .then(result => {
         return result && result.nodes
      })

export const problem = (client: APIClient) => (id: string) => {
   // TODO: mock problem
   // if(DEBUG)
   //    return new Promise<ResponseDataProblem>((resolve) => {})

   return client.query<ResponseProblem>({
      query: gql(problemGql),
      variables: {
         id
      }
   })
      .then(result => result.data && result.data.problem)
}

export const inputOutputTypes = (client: APIClient) => () =>
   client.query<ResponseInputOutputTypes>({
      query: gql(inputOutputTypesGql)
   })
   .then(result => result.data && {
      inputs: result.data.programInputTypes.nodes,
      outputs: result.data.programOutputTypes.nodes
   })

export const tags = (client: APIClient) => () => {
   if(DEBUG)
      return mockTags()

   return client.query<ResponseTags>({
      query: gql(tagsGql)
   })
      .then(result => result.data && result.data.tags.nodes)
}

// TODO: complete typesation for non parametred queries
function generateQuery<V, T, R>(graphql: any, formatter: (result: T) => R) {
   return (client: APIClient) => (variables: V) =>
      client.query<T>({
         query: gql(graphql),
         variables
      })
         .then(result => result.data && formatter(result.data))
}
