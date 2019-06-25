import deepMap from "deep-map";

const keysForMapDays: Array<string> = []
const keyMath = /.+(Date|At)$/gm

// Transform to date types fields with matched names
export function dateToStringFormatter <T>(t: T): T {
   return deepMap<T>(t, (value, key) => {
      if(typeof key === "number")
         return value

      if(keysForMapDays.indexOf(key) === -1 && !key.match(keyMath))
         return value

      if(value === null || value === undefined)
         return value

      return new Date(value)
   })
}
