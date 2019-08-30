import { SymFor} from './utils'
import { StateMemory} from './memory'
import { Observable, Subject, Subscription} from 'rxjs'
import { Payload} from 'vuex'

// This object can't be mapped tp producer
export type AtomicObject =
   | Function
   | Map<any, any>
   | WeakMap<any, any>
   | Set<any>
   | WeakSet<any>
   | Promise<any>
   | Date
   | RegExp
   | Boolean
   | Number
   | String

export type ProxyRevoke = () => void

// Some object data which can be wrapped by proxy
export interface AbstractData {
   [key: string]: any
}

// Proxy wrapper on abstract data
export interface EventProducer extends AbstractData {

}

export enum EventType {
   GetProperty = 'GetProperty',
   SetProperty = 'SetProperty',
   DeleteProperty = 'DeleteProperty',
}

export interface ModelEvent<T> {
   type: EventType | string
   date: number
   payload: T
}

// Type of connection between entities,
// without database used only "Simple"
export enum ModelAttributeType {
   Simple = 'Simple',
   OneToMany = 'OneToMany',
   OneToOne = 'OneToOne',
}

export interface IEventDispatcher<Payload> {
   eventsSubject: Subject<ModelEvent<Payload | undefined>>

   dispatch(type: string, payload?: Payload, date?: number): any
}

export interface IModelEventDispatcher<Payload extends ModelEventPayload = ModelEventPayload> extends IEventDispatcher<Payload> {
   get(prop: PropertyKey, store: IProducerStore): any
   set<T>(prop: PropertyKey, oldValue: T, newValue: T, store: IProducerStore): any
   delete(prop: PropertyKey, store: IProducerStore): any
}

export type ProducerStoreGetter<T = AbstractData> = (store: IProducerStore<T>, prop: PropertyKey) => any

export type ProducerStoreSetter<T = AbstractData> = (store: IProducerStore<T>, prop: PropertyKey, value: any) => boolean

export interface ProducerStoreOptions<T = AbstractData> {
   base: T
   dispatcher: IModelEventDispatcher
   revoke?: ProxyRevoke
   proxy?: EventProducer
   reducers?: EventReducersMap
   memory?: StateMemory<ModelEvent<any>>
   parent?: IProducerStore
   subscription?: Subscription
   getter?: ProducerStoreGetter<T>
   setter?: ProducerStoreSetter<T>
}

export interface IProducerStore<T = AbstractData> extends ProducerStoreOptions<T> {
   stream: Observable<ModelEvent<any>> | undefined
}

export type EventReducer<T> = (store: IProducerStore, event: T) => boolean | Promise<boolean | undefined | void> | undefined | void

export interface EventReducersMap {
   [key: string]: EventReducer<any> | undefined
   [EventType.GetProperty]?: EventReducer<ModelEventGetPropertyPayload>
   [EventType.SetProperty]?: EventReducer<ModelEventSetPropertyPayload>
   [EventType.DeleteProperty]?: EventReducer<ModelEventGetPropertyPayload>
}

export const ProducerStoreReference = SymFor('storage.ts')

export interface ModelEventPayload {
   store: IProducerStore
}

export interface PropertyEventPayload {
   type: ModelAttributeType
   name: PropertyKey
}

export interface ModelEventInnerPayload<T> extends ModelEventPayload, PropertyEventPayload {
   inner?: ModelEventInnerPayload<T> | T
}

export interface ModelEventGetPropertyPayload extends ModelEventPayload, PropertyEventPayload, ModelEventInnerPayload<ModelEventGetPropertyPayload> {
}

export type ModelEventDeletePropertyPayload = ModelEventGetPropertyPayload

export interface ModelEventSetPropertyPayload extends ModelEventPayload, PropertyEventPayload, ModelEventInnerPayload<ModelEventSetPropertyPayload> {
   oldValue?: any
   newValue?: any
   // If have inner payload then old and new value is undefined
}

export type StateResolver<T> = (memory: StateMemory<T>) => boolean

