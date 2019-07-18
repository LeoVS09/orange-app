import {APIClient, makeClient} from './client'
import urls from '../urls.json'
import deepMap from 'deep-map'

// const DEBUG = process.env.NODE_ENV !== 'production'
const DEBUG = false

export const client = makeClient(urls.DATABASE_SERVER)


// TODO: complete typesation for non parametred queries
export function generateQuery<V, T, R>(query: any, formatter: (result: T) => R | null, mock?: (variables: V) => Promise<R>) {
   if (DEBUG && mock) {
      return (variables: V) => mock(variables)
   }

   return mapRequester((client) => (variables: V) =>
      client.query<T>({
         query,
         variables,
      })
         .then((result) => result.data && formatter(result.data)))
}

export function generateSimpleQuery<T, R>(query: any, formatter: (result: T) => R | null, mock?: () => Promise<R>) {
   if (DEBUG && mock) {
      return () => mock()
   }

   return mapRequester((client) => () =>
      client.query<T>({
         query,
      })
         .then((result) => result.data && formatter(result.data)),
   )
}

export function generateMutation<V, T, R>(mutation: any, formatter: (result: T) => R | null, mock?: (variables: V) => Promise<R>) {
   if (DEBUG && mock) {
      return (variables: V) => mock(variables)
   }

   return mapRequester((client) => (variables: V) =>
      client.mutate<T>({
         mutation,
         variables,
      })
         .then((result) => result.data && formatter(result.data)),
   )
}

// mapRequester transform date string to date objects, but currently TypeScript don't have support
// for so advanced templates, so just know this fact when set types of request result

function mapRequester<R>(requester: (client: APIClient) => R): R  {
   const wrapped = requester(client)

   // @ts-ignore
   return async (input: any) => {
      // @ts-ignore
      const result = await wrapped(input)
      if (!result) {
         return result
      }

      return dateToStringFormatter(result)
   }
}

const keysForMapDays: string[] = []
const keyMath = /.+(Date|At)$/gm

// Transform to date types fields with matched names
function dateToStringFormatter <T>(t: T): T {
   return deepMap<T>(t, (value, key) => {
      if (typeof key === 'number') {
         return value
      }

      if (keysForMapDays.indexOf(key) === -1 && !key.match(keyMath)) {
         return value
      }

      if (value === null || value === undefined) {
         return value
      }

      return new Date(value)
   })
}
