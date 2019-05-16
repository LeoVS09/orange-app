import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import countriesGql from './Countries.graphql'
import problemsGql from './problems.graphql'
import partialProblemsGql from './partialProblems.graphql'
import problemGql from './Problem.graphql'
import inputOutputTypesGql from './inputOutputTypes.graphql'
import tagsGql from './tags.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";
import {
   ResponseCountries,
   ResponseCurrentUser, ResponseInputOutputTypes,
   ResponsePartialProblemsList,
   ResponseProblem,
   ResponseProblemsList,
   ResponseSearchCountries, ResponseTags
} from "./types";


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

export const countries = (client: APIClient) => () =>
   client.query<ResponseCountries>({
      query: gql(countriesGql)
   })
      .then(result => result.data && result.data.countries.nodes)


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

export const problem = (client: APIClient) => (id: string) =>
   client.query<ResponseProblem>({
      query: gql(problemGql),
      variables: {
         id
      }
   })
      .then(result => result.data && result.data.problem)

export const inputOutputTypes = (client: APIClient) => () =>
   client.query<ResponseInputOutputTypes>({
      query: gql(inputOutputTypesGql)
   })
   .then(result => result.data && {
      inputs: result.data.programInputTypes.nodes,
      outputs: result.data.programOutputTypes.nodes
   })

export const tags = (client: APIClient) => () =>
   client.query<ResponseTags>({
      query: gql(tagsGql)
   })
      .then(result => result.data && result.data.tags.nodes)
