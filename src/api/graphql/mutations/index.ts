import loginGql from './login.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";

export interface ILogin {
   login: {
      user: {
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
}

export const login = (client: APIClient) => (variables: { username: string, password: string }) => {
   return client.mutate<ILogin>({
      mutation: gql(loginGql),
      variables
   })
      .then(result => result.data && result.data.login.user)
}
