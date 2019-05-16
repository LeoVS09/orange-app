import {APIClient, makeClient} from "../graphql/apollo";
import urls from "../urls.json";
import deepMap from "deep-map";

const client = makeClient(urls.DATABASE_SERVER);

// mapRequester transform date string to date objects, but currently TypeScript don't have support
// for so advanced templates, so just know this fact when set types of request result

export function mapRequester<R>(requester: (client: APIClient) => R): R  {
   const wrapped = requester(client)

   // @ts-ignore
   return async (input: any) => {
      // @ts-ignore
      const result = await wrapped(input)
      if(!result)
         return result

      return dateToStringFormatter(result)
   }
}

const keysForMapDays = ['createdAt', 'updatedAt', 'publishedAt', 'publicationDate']

// Transform to date types fields with matched names
function dateToStringFormatter <T>(t: T): T {
   return deepMap<T>(t, (value, key) => {
      if(typeof key === "number")
         return value

      if(keysForMapDays.indexOf(key) === -1)
         return value

      return new Date(value)
   })
}
