import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
import allCountriesGql from './allCountries.graphql'
import allProblemsGql from './allProblems.graphql'
import getProblemGql from './getProblem.graphql'
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

export interface IProblem {
   id: string
   name: string
   description: string
   inputDescription: string
   outputDescription: string
   note: string
   programInputType: {
      id: string
      name: string
   }
   programOutputType: {
      id: string
      name: string
   }
   limitTime: number
   limitMemory: number
   isOpen: boolean
   createdAt: string
   updatedAt: string
   publishedAt: string
   author_profile: {
      id: string
      user: {
         name: string
      }
   }
   tester_profile: {
      id: string
      user: {
         name: string
      }
   }
   problemsToTags: {
      nodes: Array<{
         tag: {
            id: string
            name: string
         }
      }>
   }

   tests: {
      nodes: Array<{
         id: string
         index: number
         input: string
         output: string
         public: boolean
         createdAt: string
         updatedAt: string
      }>
   }
}

export interface IAllProblems {
   allProblems: {
      totalCount: number
      nodes: Array<IProblem>
   }
}

export const allProblems = (client: APIClient) => () =>
   client.query<IAllProblems>({
      query: gql(allProblemsGql)
   })
      .then(result => result.data && result.data.allProblems)
      .then(result => {
         console.log('allProblems', result)
         return result && result.nodes
      })

export interface IGetProblem {
   problemById: IProblem
}

export const getProblem = (client: APIClient) => (id: string) =>
   client.query<IGetProblem>({
      query: gql(getProblemGql),
      variables: {
         id
      }
   })
      .then(result => result.data && result.data.problemById)
