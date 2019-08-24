import {
   IProducerStore,
   ModelAttributeType,
   ProducerStoreReference
} from "../types";
import {getStore, isProducerable} from "../common";
import {pushPropertyEventsToParent} from "../toParent";
import {wrapInProducerIfNot} from "./wrap";

export function get(store: IProducerStore, prop: PropertyKey) {
   if (
      typeof prop === 'symbol' ||
      // Directly check with reference
      // when ProducerStoreReference is string
      prop === ProducerStoreReference
   )
      return store

   const {dispatcher, base, getter, setter} = store

   dispatcher.get(prop, store)

   const value = getter
      ? getter(store, prop)
      : base[prop]

   if (!isProducerable(value))
      return value

   const producer = wrapInProducerIfNot(value)

   // TODO: refactor
   if (producer !== value){
      if(setter)
         setter(store, prop, producer)
      else
         base[prop] = producer
   }

   const valueStore = getStore(value)

   pushPropertyEventsToParent(store,
      valueStore,
      prop,
      !Array.isArray(base)
         ? ModelAttributeType.OneToOne
         : ModelAttributeType.OneToMany
   )

   return value
}

export function set(store: IProducerStore, prop: PropertyKey, value: any) {
   const {base, dispatcher, setter, getter} = store
   if(typeof prop === 'symbol') {
      base[prop as unknown as string] = value
      return true
   }

   const oldValue = getter
      ? getter(store, prop)
      : base[prop as unknown as string]

   dispatcher.set(prop, oldValue, value, store)

   if(setter)
      return setter(store, prop, value)

   base[prop as unknown as string] = value

   return true
}

export function deleteProperty(store: IProducerStore, prop: PropertyKey) {
   const {base, dispatcher} = store

   // The `undefined` check is a fast path for pre-existing keys.
   if (base[prop as unknown as string] !== undefined || prop in base) {
      dispatcher.delete(prop, store)

      // We not do actual delete,
      // because in some cases event cannot be handled after property deleted
      // delete base[prop]
   }

   return true
}
