import {IEntityTypeSchema} from "@/lazyDB/database/types";
import {IProducerStore, ModelAttributeType, ProducerStoreGetter, ProducerStoreSetter} from "@/lazyDB/core/types";
import {getStore, isProducer} from "@/lazyDB/core/common";
import {applyListControls, makeListSource, setter as listSetter} from './list'

export const applyRepositoryControls = (store: IProducerStore, schema: IEntityTypeSchema) => {
   store.getter = getter(schema)
   store.setter = setter(schema)
}

export const getter = (schema: IEntityTypeSchema): ProducerStoreGetter => ({base}, name) => {
   const value = base[name as string]
   if (typeof value !== "undefined")
      return value

   const type = schema[name as string]
   if (!type || type === ModelAttributeType.Simple)
      return

   if (type === ModelAttributeType.OneToOne)
      return {}

   if (type === ModelAttributeType.OneToMany)
      return makeListSource()

   console.error('Unexpected model attribute type:', type)
}

export const setter = (schema: IEntityTypeSchema): ProducerStoreSetter => ({base}, name, value) => {
   base[name as string] = value

   if (!isProducer(value))
      return true

   const type = schema[name as string]
   if (!type || type === ModelAttributeType.Simple)
      return true

   if (type === ModelAttributeType.OneToOne)
      return true

   if (type === ModelAttributeType.OneToMany) {
      const store = getStore(value)
      applyListControls(store)

      return true
   }

   console.error('Unexpected model attribute type:', type)
   return true
}
