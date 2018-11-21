import currentUserGql from './currentUser.graphql'
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
      nodes: {
        email: string
        isVerified: boolean
        createdAt: string
        updatedAt: string
      }
    }
  }
}

export const currentUser = (client: APIClient) => () => {
  return client.query<ICurrentUser>({
    query: gql(currentUserGql)
  })
    .then(result => result.data && result.data.currentUser)
}



