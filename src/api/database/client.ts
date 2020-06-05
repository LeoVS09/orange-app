import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import { APIClient } from '@/lazyDB/adapters/graphql'

function extractRealError(e: any) {
  if (e.graphQLErrors && e.graphQLErrors[0].message)
    return e.graphQLErrors[0].message

  console.log(JSON.stringify(e))
  return e
}

export function makeClient(uri: string): APIClient {
  const { apolloClient: client } = createApolloClient({
    httpEndpoint: uri,
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false,
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false,
    // Is being rendered on the server?
    ssr: false

  })

  return {
    mutate: options => new Promise((resolve, reject) => {
      // fix bug with apollo throw error
      try {
        client.mutate(options)
        // @ts-ignore
          .then(resolve)
          .catch(e => reject(extractRealError(e)))
      } catch (e) {
        reject(extractRealError(e))
      }
    }),
    query: options => new Promise((resolve, reject) => {
      try {
        client.query(options)
        // @ts-ignore
          .then(resolve)
          .catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}
