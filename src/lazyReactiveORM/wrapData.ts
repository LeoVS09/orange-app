import {ModelObserver} from "./ModelObserver";
import {AbstractData} from "./types";

export function wrapData(model: ModelObserver) {

   return new Proxy<AbstractData>(model.data, {

      get(target: AbstractData, property: string | number | symbol): any {
         if(typeof property === 'number' || typeof property === 'symbol')
            return null

         const result = model.get(property)
         console.log('get', property, result)
         return result
      },

      set(target: AbstractData, property: string, value: any): boolean {
         return model.set(property, value)
      },

      has(target: AbstractData, property: string): boolean {
         return model.has(property)
      },

      ownKeys(): PropertyKey[] {
         return Object.keys(model.schema)
      }
   })
}
