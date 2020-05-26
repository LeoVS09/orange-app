import { Observable, Subject, Subscription } from 'rxjs'
import { AosFieldType } from '@/abstractObjectSchema'
import { SymFor } from './utils'
import { StateMemory } from './memory'

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
export type Producerable<T = any> = {
   [key: string]: T
   [index: number]: T
}

type Proxy<T> = {
   get(): T;
   set(value: T): void;
}

// Proxy wrapper on abstract data
export type Proxyfy<T> = {
   [P in keyof T]: Proxy<T[P]>;
}

export const ProducerStoreReference = SymFor('storage') as 'storage'

export type EventProducer<T> = Proxyfy<T> & {
   [ProducerStoreReference]: IProducerStore<T>
}

export enum PropertyEventType {
   GetProperty = 'GetProperty',
   SetProperty = 'SetProperty',
   DeleteProperty = 'DeleteProperty',
}

export interface ModelEvent<Payload = PropertyEventPayload, Type extends any = any> {
   type: Type
   date: number
   payload: Payload
}

export interface IEventDispatcher<TP extends TypesToPayloadsMap<any> = TypesToPayloadsMap> {
   eventsSubject: Subject<ModelEvent<TP[keyof TP], keyof TP>>

   dispatch<Type extends keyof TP>(type: Type, payload: TP[Type], date?: number): any
}

export type ModelTypesToPayloadsMap<
   Store extends IProducerStore<any, any> = IProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey
> = {
   [type: string]: any
   [PropertyEventType.GetProperty]: ModelEventGetPropertyPayload<Store, Key>
   [PropertyEventType.SetProperty]: ModelEventSetPropertyPayload<Store, Key>
   [PropertyEventType.DeleteProperty]: ModelEventDeletePropertyPayload<Store, Key>
}

export interface IModelEventDispatcher<
   Store extends IProducerStore<any, any> = IProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey,
   TP extends ModelTypesToPayloadsMap<Store, Key> = ModelTypesToPayloadsMap<Store, Key>,
>
   extends IEventDispatcher<TP> {

   getPropertyType(name: Key, store: Store): AosFieldType

   get(prop: Key, store: Store): any
   set<V>(prop: Key, oldValue: V, newValue: V, store: Store): any
   delete(prop: Key, store: Store): any
}

export interface ProducerStoreGetter<Store extends IProducerStore<any, any> = IProducerStore, Result = any> {
   (store: Store, prop: ModelPropertyKey): Result
}

export interface ProducerStoreSetter<Store extends IProducerStore<any, any> = IProducerStore, Value = any> {
   (store: Store, prop: ModelPropertyKey, value: Value): boolean
}

export interface ParentLink<Store extends IProducerStore<any, any> = IProducerStore> {
   // parent store object
   store: Store
   // proprty name, which was used to get child from parent
   name: ModelPropertyKey
}

export interface ExtendTemporalTrap<Store extends IProducerStore<any, any> = IProducerStore> {
   (trapStore: Store): void
}

export interface IProducerStore<
   T extends Producerable<any> = any,
   TP extends ModelTypesToPayloadsMap<any, any> = any
> {
   base: T
   dispatcher: IModelEventDispatcher<IProducerStore<T, TP>, ModelPropertyKey, TP>
   revoke?: ProxyRevoke
   proxy?: EventProducer<T>

   // Move possible types in separate classes
   stream: Observable<ModelEvent<TP[keyof TP], keyof TP>> | undefined
   memory?: StateMemory<ModelEvent<TP[keyof TP], keyof TP>>
   parent?: ParentLink<any>
   subscription?: Subscription

   getter: ProducerStoreGetter<IProducerStore<T, TP>>
   setter: ProducerStoreSetter<IProducerStore<T, TP>>

   extendTemporalTrap?: ExtendTemporalTrap
}

export function isProducerStore<Store extends IProducerStore<any, any> = IProducerStore>(store: any): store is Store {
  if (typeof store !== 'object')
    return false

  return !!(store.base && store.dispatcher && store.getter && store.setter)
}

export interface ProducerStoreOptions<
   T extends Producerable<any> = Producerable,
   TP extends ModelTypesToPayloadsMap<any, any> = ModelTypesToPayloadsMap<any>
> extends Partial<Omit<IProducerStore<T, TP>, 'proxy' | 'revoke'>> {
   base: T
   dispatcher: IModelEventDispatcher<IProducerStore<T, TP>, ModelPropertyKey, TP>
}

export interface EventReducer<
   Store = any,
   Payload = any,
   Result = boolean | Promise<boolean | void> | void,
> {
   (store: Store, event: ModelEvent<Payload>): Result
}
export type AtomicEventReducer<Store = any, Payload = any> = EventReducer<Store, Payload, boolean | void>

export type TypesToPayloadsMap<Keys extends keyof any = string, Payload extends ModelEventPayload<any> = ModelEventPayload<any>> = Record<Keys, Payload>

export type EventReducersMap<Store extends IProducerStore<any, any>, TP extends TypesToPayloadsMap> = {
   [Key in keyof TP]: TP[Key] extends ModelEventPayload<Store> ? EventReducer<Store, TP[Key]> : void
}

export type AtomicEventReducersMap<Store extends IProducerStore<any, any>, TP extends TypesToPayloadsMap> = {
   [Key in keyof TP]: TP[Key] extends ModelEventPayload<Store> ? AtomicEventReducer<Store, TP[Key]> : void
}

export interface ModelEventPayload<Store extends IProducerStore<any, any> = IProducerStore> {
   store: Store
}

export const propertyEventTypes = [PropertyEventType.GetProperty, PropertyEventType.SetProperty, PropertyEventType.DeleteProperty]

export type ModelPropertyKey = string | number

export interface PropertyEventPayload<Key extends ModelPropertyKey = ModelPropertyKey> {
   type: AosFieldType
   name: Key
}

export interface ModelEventPropertyPayload<
   Store extends IProducerStore<any, any> = IProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey
>
 extends ModelEventPayload<Store>, PropertyEventPayload<Key> {}

export interface ModelEventGetPropertyPayload<
   Store extends IProducerStore<any, any> = IProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey
>
   extends ModelEventPropertyPayload<Store, Key> {}

export interface ModelEventDeletePropertyPayload<
   Store extends IProducerStore<any, any> = IProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey
>
   extends ModelEventPropertyPayload<Store, Key> {}

export interface ModelEventSetPropertyPayload<
   Store extends IProducerStore<any, any> = IProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey,
   OldValue = any,
   NewValue = any
>
   extends ModelEventPropertyPayload<Store, Key> {
   oldValue: OldValue
   newValue: NewValue
}

export type BaseEventsPayloads<Store extends IProducerStore<any, any> = IProducerStore> =
   ModelEventGetPropertyPayload<Store> & ModelEventSetPropertyPayload<Store> & ModelEventDeletePropertyPayload<Store>

export function isPropertyEvent(event: ModelEvent<any>): event is ModelEvent<PropertyEventPayload> {
  return propertyEventTypes.includes(event.type as PropertyEventType)
}

export type StateResolver<T> = (memory: StateMemory<T>) => boolean
