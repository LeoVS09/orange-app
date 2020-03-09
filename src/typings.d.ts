
declare module '*.json' {
  const value: any
  export default value
}

declare module '*.gql' {
  const content: any
  export default content
}

declare module '*.graphql' {
  const content: any
  export default content
}

declare module '*.vue' {
   import Vue from 'vue'

   export default Vue
}

declare module 'lodash.throttle' {
  const content: any
  export default content
}

declare module 'crypto-js' {
  const content: any
  export default content
}

declare module 'v-click-outside' {
  const content: any
  export default content
}

/* eslint-disable */
declare module 'vue-cli-plugin-apollo/graphql-client' {
  import { ApolloClient, ApolloClientOptions, Resolvers } from 'apollo-client'
  import { DocumentNode } from 'apollo-link'
  import { SubscriptionClient } from 'subscriptions-transport-ws'
  import { ClientStateConfig } from 'apollo-link-state'
  import { InMemoryCacheConfig } from 'apollo-cache-inmemory'

  export interface ApolloClientClientConfig<TCacheShape> {
    // URL to the HTTP API
    httpEndpoint?: string
    // Url to the Websocket API
    wsEndpoint?: string
    // Token used in localstorage
    tokenName?: string
    // Enable this if you use Query persisting with Apollo Engine
    persisting?: boolean
    // Is currently Server-Side Rendering or not
    ssr?: boolean
    // Only use Websocket for all requests (including queries and mutations)
    websocketsOnly?: boolean
    // Custom starting link.
    // If you want to replace the default HttpLink, set `defaultHttpLink` to false
    link?: string
    // If true, add the default HttpLink.
    // Disable it if you want to replace it with a terminating link using `link` option.
    defaultHttpLink?: boolean
    // Options for the default HttpLink
    httpLinkOptions?: object
    // Custom Apollo cache implementation (default is apollo-cache-inmemory)
    cache?: any | false
    // Options for the default cache
    inMemoryCacheOptions?: InMemoryCacheConfig
    // Additional Apollo client options
    apollo?: ApolloClientOptions<TCacheShape>
    // apollo-link-state options
    clientState?: ClientStateConfig
    // Function returning Authorization header token
    getAuth?: (tokenName: string) => string | void
    // Local Schema
    typeDefs?: string | string[] | DocumentNode | DocumentNode[]
    // Local Resolvers
    resolvers?: Resolvers | Resolvers[]
    // Hook called when you should write local state in the cache
    onCacheInit?: (cache: any) => void
  }

  export function createApolloClient<TCacheShape>(
    config: ApolloClientClientConfig<TCacheShape>
  ): {
    apolloClient: ApolloClient<TCacheShape>
    wsClient: SubscriptionClient
    // stateLink: withClientState
  }

  export function restartWebsockets(wsClient: SubscriptionClient): void
}
