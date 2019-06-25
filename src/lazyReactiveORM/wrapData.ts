import {
   AbstractData,
   ModelObserver
} from "./ModelObserver";

export function wrapData(model: ModelObserver) {

   return new Proxy<AbstractData>(model.data, {

      get(target: AbstractData, property: string | number | symbol): any {
         if(typeof property === 'number' || typeof property === 'symbol')
            return null

         return model.get(property)
      },

      set(target: AbstractData, property: string, value: any): boolean {
         return model.set(property, value)
      },

      has(target: AbstractData, property: string): boolean {
         return model.has(property)
      },

      ownKeys(): PropertyKey[] {
         return model.schema
      }
   })
}
