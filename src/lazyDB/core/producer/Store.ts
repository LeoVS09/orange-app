import {
   AbstractData,
   EventProducer,
   EventReducersMap,
   IModelEventDispatcher,
   IProducerStore, ModelEvent, ModelEventPayload, ProducerStoreOptions,
   ProxyRevoke
} from "@/lazyDB/core/types";
import {StateMemory} from "@/lazyDB/core/memory";
import {Observable, Subscription} from "rxjs";

export class ProducerStore implements IProducerStore {
   public base: AbstractData
   public dispatcher: IModelEventDispatcher
   public revoke?: ProxyRevoke
   public proxy?: EventProducer
   public reducers?: EventReducersMap
   public memory?: StateMemory<ModelEvent<any>>
   public parent?: IProducerStore
   public subscription?: Subscription
   public getter?: (store: IProducerStore, prop: PropertyKey) => any
   public setter?: (store: IProducerStore, prop: PropertyKey, value: any) => boolean
   private _stream?: Observable<ModelEvent<any>>

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

   set stream(value: Observable<ModelEvent<any>> | undefined) {
      this._stream = value
   }

   get stream() {
      if(this._stream)
         return this._stream

      if (!this.dispatcher)
         return;

      return this.dispatcher.eventsSubject
   }
}
