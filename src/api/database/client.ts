import {
   ApolloClient,
   MutationOptions,
   OperationVariables,
   QueryOptions,
} from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import {ExecutionResult} from 'graphql'

export interface APIClient {
   mutate<T, TVariables = OperationVariables>(options: MutationOptions<T, TVariables>): Promise<ExecutionResult<T>>

   query<T, TVariables = OperationVariables>(options: QueryOptions<TVariables>): Promise<ExecutionResult<T>>
}

function extractRealError(e: any) {
   if (e.graphQLErrors && e.graphQLErrors[0].message) {
      return e.graphQLErrors[0].message
   }
   console.log(JSON.stringify(e))
   return e
}

export function makeClient(uri: string): APIClient {
   const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
         uri,
         credentials: 'include',
      }),
   })

   return {
      mutate: (options) => new Promise((resolve, reject) => {
         // fix bug with apollo throw error
         try {
            client.mutate(options)
            // @ts-ignore
               .then(resolve)
               .catch((e) => reject(extractRealError(e)))

         } catch (e) {
            reject(extractRealError(e))
         }

      }),
      query: (options) => new Promise((resolve, reject) => {

         try {
            client.query(options)
            // @ts-ignore
               .then(resolve)
               .catch(reject)

         } catch (e) {
            reject(e)
         }
      }),
   }
}
