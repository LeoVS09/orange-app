import {ModelObserver} from "./ModelObserver";
import {AbstractData, ModelAttributeType} from "./types";
import {Subject} from "rxjs";
import {ModelEventGetPropertyPayload, ModelEventType} from "@/lazyReactiveORM/events";

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

export function makeTrap(target = {}) {
   const subject = new Subject()

   const data = new Proxy<AbstractData>(target, {
      // TODO: duplicated code, make data as emitter
      get(target: AbstractData, property: string | number | symbol): any {
         if(typeof property === 'number' || typeof property === 'symbol')
            return null

         const payload: ModelEventGetPropertyPayload = {name: property, type: ModelAttributeType.Simple}
         subject.next({type: ModelEventType.GetProperty, payload, date: Date.now()})
         return null
      },

      // TODO: is this need?
      set(target: AbstractData, property: string | number | symbol, value: any): boolean {
         return false
      },

      has(target: AbstractData, p: string | number | symbol): boolean {
         return false
      },

      ownKeys(target: AbstractData): PropertyKey[] {
         return []
      }
   })

   return [data, subject]
}
