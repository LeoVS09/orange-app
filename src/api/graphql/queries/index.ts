import currentUserGql from './currentUser.graphql'
import searchCountriesGql from './searchCountries.graphql'
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

interface ISearchCountries {
  searchCountries: {
    nodes: Array<{
      id: string
      nodeId: string
      name: string
    }>
  }
}

export const searchCountries = (client: APIClient) => (name: string) => {
  return client.query<ISearchCountries>({
    query: gql(searchCountriesGql),
		variables: {
    	name
		}
  })
    .then(result => result.data && result.data.searchCountries.nodes)
}



