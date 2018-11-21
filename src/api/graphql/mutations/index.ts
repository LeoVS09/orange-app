import loginGql from './login.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";

interface ILogin {
  login: {
    user: {
      id: string,
      name: string,
      nodeId: string,
      username: string
    }
  }
}

export const login = (client: APIClient) => (variables: {username: string, password: string}) => {
  return client.mutate<ILogin>({
    mutation: gql(loginGql),
    variables
  })
    .then(result => result.data && result.data.login.user)
}
