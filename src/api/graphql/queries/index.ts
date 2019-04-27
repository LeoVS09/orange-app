import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import countriesGql from './Countries.graphql'
import problemsGql from './problems.graphql'
import problemGql from './Problem.graphql'
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

interface ICountries {
   countries: {
      nodes: Array<{
         id: string
         name: string
         createdAt: string
         updatedAt: string
      }>
   }
}

export const countries = (client: APIClient) => () =>
   client.query<ICountries>({
      query: gql(countriesGql)
   })
      .then(result => result.data && result.data.countries.nodes)

export interface ITest {
   id: string
   index: number
   input: string
   output: string
   public: boolean
   createdAt: string
   updatedAt: string
}

export interface IProblem {
   id: string
   name: string
   description: string
   inputDescription: string
   outputDescription: string
   note: string
   inputType: {
      id: string
      name: string
   }
   outputType: {
      id: string
      name: string
   }
   limitTime: number
   limitMemory: number
   isOpen: boolean
   createdAt: string
   updatedAt: string
   publishedAt: string
   author: {
      id: string
      user: {
         name: string
      }
   }
   tester: {
      id: string
      user: {
         name: string
      }
   }
   problemsTags: {
      nodes: Array<{
         tag: {
            id: string
            name: string
         }
      }>
   }

   tests: {
      nodes: Array<ITest>
   }
}

export interface IProblems {
   problems: {
      totalCount: number
      nodes: Array<IProblem>
   }
}

export const problems = (client: APIClient) => () =>
   client.query<IProblems>({
      query: gql(problemsGql)
   })
      .then(result => result.data && result.data.problems)
      .then(result => {
         console.log('problems', result)
         return result && result.nodes
      })

export interface IProblem {
   problem: IProblem
}

export const problem = (client: APIClient) => (id: string) =>
   client.query<IProblem>({
      query: gql(problemGql),
      variables: {
         id
      }
   })
      .then(result => result.data && result.data.problem)
