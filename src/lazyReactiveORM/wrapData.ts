import {ModelObserver} from "./ModelObserver";
import {AbstractData, IPredefinedSchema, ModelAttributeType, ModelSchema} from "./types";
import {Subject} from "rxjs";
import {ModelEvent, ModelEventGetPropertyPayload, ModelEventType} from "@/lazyReactiveORM/events";
import {isSchemaField} from "@/lazyReactiveORM/utils";
import {filter, map} from "rxjs/operators";

export function wrapData(model: ModelObserver) {

   return new Proxy<AbstractData>(model.data, {

      get(target: AbstractData, property: string | number | symbol): any {
         if (typeof property === 'number')
            return null

         if(typeof property === 'symbol')
            return model.data[property as unknown as string]

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

export function makeTrap(target = {}): Array<AbstractData | Subject<ModelEvent>> {
   const subject = new Subject<ModelEvent>()

   const data = new Proxy<AbstractData>(target, {
      // TODO: duplicated code, make data as emitter
      get(target: AbstractData, property: string | number | symbol): any {
         if (typeof property === 'number' || typeof property === 'symbol')
            return null

         if (target[property])
            return target[property]

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

export function makeTrapBySchemas(
   schema: IPredefinedSchema,
   target: {[key: string]: any} = {}
) {
   const [resultTrap, resultStream] = makeTrap(target)

   Object.keys(schema).forEach(key => {
      let type = schema[key]

      if(isSchemaField(type))
         type = type.type

      if(type === ModelAttributeType.Simple)
         return

      const [trap, stream] = makeTrap()
      stream
         .pipe(
            filter((event: ModelEvent) => event.type === ModelEventType.GetProperty),
            map((event: ModelEvent) => ({name: key, inner: event.payload, type}) as ModelEventGetPropertyPayload),
            map((payload: ModelEventGetPropertyPayload) => ({type: ModelEventType.GetProperty, payload, date: Date.now()}) as ModelEvent)
         )
         .subscribe((event: ModelEvent) => {
            console.log('event in trap in schema', event)
            resultStream.next(event)
         })

      if(type === ModelAttributeType.OneToOne){
         target[key] = trap
         return;
      }

      if(type === ModelAttributeType.OneToMany) {
         target[key] = {
            nodes: [trap]
         }
         return;
      }
   })

   return [resultTrap, resultStream]
}
