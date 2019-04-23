import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import allCountriesGql from './allCountries.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";


interface ICurrentUser {
   currentUser: {
      id: string
      nodeId: string
      name: string
      isAdmin: boolean
      avatarUrl: string
      userEmails: {
         nodes: Array<{
            email: string
            isVerified: boolean
            createdAt: string
            updatedAt: string
         }>
      },

      profiles: {
         nodes: Array<{
            id: string,
            firstName: string,
            lastName: string,
            familyName: string,
            phone: string,
            groupNumber: string,
            course: number,
            isTeacher: boolean,
            createdAt: string,
            updatedAt: string,
            city: {
               id: string,
               name: string
            },
            university: {
               id: string,
               shortName: string,
               longName: string
            }
         }>
      }
   }
}

export const currentUser = (client: APIClient) => () =>
   client.query<ICurrentUser>({
      query: gql(currentUserGql)
   })
      .then(result => result.data && result.data.currentUser)

interface ISearchCountries {
   searchCountries: {
      nodes: Array<{
         id: string
         nodeId: string
         name: string
      }>
   }
}

export const searchCountries = (client: APIClient) => (name: string) =>
   client.query<ISearchCountries>({
      query: gql(searchCountriesGql),
      variables: {
         name
      }
   })
      .then(result => result.data && result.data.searchCountries.nodes)

interface IAllCountries {
   allCountries: {
      nodes: Array<{
         id: string
         name: string
         createdAt: string
         updatedAt: string
      }>
   }
}

export const allCountries = (client: APIClient) => (name: string) =>
   client.query<IAllCountries>({
      query: gql(allCountriesGql)
   })
      .then(result => result.data && result.data.allCountries.nodes)
      .then(countries => {
         console.log('countries', countries)
         return countries
      })
