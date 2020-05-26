import { Observable, Subscription } from 'rxjs'
import {
  Producerable,
  EventProducer,
  EventReducersMap,
  IModelEventDispatcher,
  IProducerStore,
  ModelEvent,
  ProducerStoreOptions,
  ProxyRevoke,
  ProducerStoreGetter,
  ProducerStoreSetter,
  ParentLink,
  ModelTypesToPayloadsMap,
  ModelPropertyKey
} from '@/lazyDB/core/types'
import { StateMemory } from '@/lazyDB/core/memory'

/* eslint-disable no-underscore-dangle */

export class ProducerStore<
  T extends Producerable<any> = Producerable,
  TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any>
> implements IProducerStore<T, TP> {
   public base: T

   public dispatcher: IModelEventDispatcher<IProducerStore<T, TP>, ModelPropertyKey, TP>

   public revoke?: ProxyRevoke

   public proxy?: EventProducer<T>

   public memory?: StateMemory<ModelEvent<TP[keyof TP], keyof TP>>

   public parent?: ParentLink<any>

   public subscription?: Subscription

   public getter: ProducerStoreGetter<IProducerStore<T, TP>>

   public setter: ProducerStoreSetter<IProducerStore<T, TP>>

   private _stream?: Observable<ModelEvent<TP[keyof TP], keyof TP>>

   constructor(options: ProducerStoreOptions<T, TP>) {
     this.base = options.base
     this.dispatcher = options.dispatcher
     this.memory = options.memory
     this.parent = options.parent
     this.subscription = options.subscription
     this.getter = options.getter || defaultGetter
     this.setter = options.setter || defaultSetter
   }

   set stream(value: Observable<ModelEvent<TP[keyof TP], keyof TP>> | undefined) {
     this._stream = value
   }

   get stream(): Observable<ModelEvent<TP[keyof TP], keyof TP>> | undefined {
     if (this._stream)
       return this._stream

     if (!this.dispatcher)
       return

     return this.dispatcher.eventsSubject
   }
}

const defaultGetter: ProducerStoreGetter<IProducerStore<any, any>> = (store, prop) =>
  store.base[prop]

const defaultSetter: ProducerStoreSetter<IProducerStore<any, any>> = (store, prop, v) => {
  store.base[prop as string] = v
  return true
}
