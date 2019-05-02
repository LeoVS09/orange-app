import loginGql from './login.graphql'
import registerGql from './register.graphql'
import gql from 'graphql-tag'
import {APIClient} from "../apollo";
import {ResponseLogin, ResponseRegister, RequestRegisterInput, RequestLoginInput} from "./types";

export const login = (client: APIClient) => (variables: RequestLoginInput) => {
   return client.mutate<ResponseLogin>({
      mutation: gql(loginGql),
      variables
   })
      .then(result => result.data && result.data.login.user)
}

export const register = (client: APIClient) => (variables: RequestRegisterInput) => {
   return client.mutate<ResponseRegister>({
      mutation: gql(registerGql),
      variables
   })
      .then(result => result.data && result.data.register.user)
}
