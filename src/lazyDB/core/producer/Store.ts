import {
   AbstractData,
   EventProducer,
   EventReducersMap,
   IModelEventDispatcher,
   IProducerStore, ModelEvent, ProducerStoreOptions,
   ProxyRevoke
} from "@/lazyDB/core/types";
import {StateMemory} from "@/lazyDB/core/memory";
import {Subscription} from "rxjs";

export class ProducerStore implements IProducerStore {
   base: AbstractData
   dispatcher: IModelEventDispatcher
   revoke?: ProxyRevoke
   proxy?: EventProducer
   reducers?: EventReducersMap
   memory?: StateMemory<ModelEvent<any>>
   parent?: IProducerStore
   subscription?: Subscription
   getter?: (store: IProducerStore, prop: PropertyKey) => any
   setter?: (store: IProducerStore, prop: PropertyKey, value: any) => boolean

   constructor(options: ProducerStoreOptions) {
      this.base = options.base
      this.dispatcher = options.dispatcher
      this.reducers = options.reducers
      this.revoke = options.revoke
      this.proxy = options.proxy
      this.memory = options.memory
      this.parent = options.parent
      this.subscription = options.subscription
      this.getter = options.getter
      this.setter = options.setter
   }

   get stream() {
      if (!this.dispatcher)
         return;

      return this.dispatcher.eventsSubject
   }
}
