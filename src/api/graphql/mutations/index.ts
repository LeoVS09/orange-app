import loginGql from './login.graphql'
import registerGql from './register.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";

export interface IUser {
   id: string
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

export interface ILogin {
   login: {
      user: IUser
   }
}

export interface IRegister {
   register: {
      user: IUser
   }
}

export const login = (client: APIClient) => (variables: { username: string, password: string }) => {
   return client.mutate<ILogin>({
      mutation: gql(loginGql),
      variables
   })
      .then(result => result.data && result.data.login.user)
}

export interface RegisterInput {
   username: string,
   email: string,
   password: string,
   name: string,
   avatarUrl?: string,
   firstName: string,
   middleName?: string
   lastName?: string
}

export const register = (client: APIClient) => (variables: RegisterInput) => {
   return client.mutate<IRegister>({
      mutation: gql(registerGql),
      variables
   })
      .then(result => result.data && result.data.register.user)
}
