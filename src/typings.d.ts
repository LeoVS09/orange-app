
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
