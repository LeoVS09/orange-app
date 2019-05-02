import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import countriesGql from './Countries.graphql'
import problemsGql from './problems.graphql'
import problemGql from './Problem.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";
import {
   ResponseCountries,
   ResponseCurrentUser,
   ResponseDataProblem,
   ResponseProblem,
   ResponseProblemsList,
   ResponseSearchCountries
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


export const problems = (client: APIClient) => () =>
   client.query<ResponseProblemsList>({
      query: gql(problemsGql)
   })
      .then(result => result.data && result.data.problems)
      .then(result => {
         console.log('problems', result)
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
