import { Observable, Subscription } from 'rxjs'
import {
  AbstractData,
  EventProducer,
  EventReducersMap,
  IModelEventDispatcher,
  IProducerStore,
  ModelEvent,
  ProducerStoreOptions,
  ProxyRevoke,
  ProducerStoreGetter,
  ProducerStoreSetter
} from '@/lazyDB/core/types'
import { StateMemory } from '@/lazyDB/core/memory'

/* eslint-disable no-underscore-dangle */

export class ProducerStore<T = AbstractData> implements IProducerStore<T> {
   public base: T

   public dispatcher: IModelEventDispatcher

   public revoke?: ProxyRevoke

   public proxy?: EventProducer

   public reducers?: EventReducersMap

   public memory?: StateMemory<ModelEvent<any>>

   public parent?: IProducerStore

   public subscription?: Subscription

   public getter: ProducerStoreGetter<T>

   public setter: ProducerStoreSetter<T>

   private _stream?: Observable<ModelEvent<any>>

   constructor(options: ProducerStoreOptions<T>) {
     this.base = options.base
     this.dispatcher = options.dispatcher
     this.reducers = options.reducers
     this.revoke = options.revoke
     this.proxy = options.proxy
     this.memory = options.memory
     this.parent = options.parent
     this.subscription = options.subscription
     this.getter = options.getter || defaultGetter
     this.setter = options.setter || defaultSetter
   }

   set stream(value: Observable<ModelEvent<any>> | undefined) {
     this._stream = value
   }

   get stream() {
     if (this._stream)
       return this._stream

     if (!this.dispatcher)
       return

     return this.dispatcher.eventsSubject
   }
}

const defaultGetter: ProducerStoreGetter<any> = (store, prop) =>
  store.base[prop as string]

const defaultSetter: ProducerStoreSetter<any> = (store, prop, v) => {
  store.base[prop as string] = v
  return true
}
