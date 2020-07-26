import {
  Producerable,
  EventProducer,
  IProducerStore,
  ModelEvent,
  EventReducer,
  ModelPropertyKey
} from '@/lazyDB/core/types'
import {
  AsyncConnectorEventTypes,
  ModelEventReadPayload,
  DatabaseModelTypesToPayloadsMap
} from '@/lazyDB/database/events'
import { SymFor } from '@/lazyDB/core/utils'
import { DatabaseDispatcher } from '@/lazyDB/database/dispatcher'
import {
  AosEntitySchemaStorage,
  AosEntitySchema,
  AosSchema,
  AosFieldType
} from '@/abstractObjectSchema'
import { RelationsField, AosParser } from '../core/aos'

export type AsyncConnectorReducer<T, R> = (store: IProducerStore, event: T) => Promise<R>

export interface AsyncConnectorReducersMap {
   [key: string]: AsyncConnectorReducer<any, any>
   [AsyncConnectorEventTypes.Read]: AsyncConnectorReducer<ModelEventReadPayload, any>
}

export type DatabaseTableMap<T extends Producerable = Producerable> = Map<string, T | EventProducer<T>>
export type DatabaseStorageMap = Map<string, DatabaseTableMap>

export type ProducerProperty<T extends Producerable<any> = Producerable> = {
   get(): EventProducer<T>
   set(value: T | EventProducer<T>): void
}

export type DatabaseTable<T extends Producerable<any> = any> = {
   [id: string]: T | EventProducer<T>
}

export interface DatabaseStorage {
   [entity: string]: DatabaseTable
}

export interface ILazyReactiveDatabase {
   storage: DatabaseStorage
   schemas: AosEntitySchemaStorage
   findOne: <T extends Producerable = Producerable>(entity: string, id: string, wrapped?: boolean) => EventProducer<T> | undefined
   set: <T extends Producerable = Producerable>(entity: string, id: string, data: T | EventProducer<T>) => void
   update: <T extends Producerable = Producerable>(entity: string, id: string, data: T | EventProducer<T>) => boolean
   add: <T extends Producerable = Producerable>(entity: string, id: string, data: T | EventProducer<T>) => void
   excludeProperties: Array<string | RegExp>
}

export const ListItemGetterReference = SymFor('list item getter') as 'list item getter'
export const ListItemSetterReference = SymFor('list item setter') as 'list item setter'
export const nodesKey = 'nodes'
export const NodesProducerReference = SymFor(`${nodesKey} producer`) as 'nodes producer'

// Need for correctly generate types on list source
export const isNodesKey = (value: any) => value === nodesKey

export type ListItemGetter = (source: ListSource, index: number) => any
export type ListItemSetter = (source: ListSource, index: number, value: any) => string | null // value id

export interface ListSource {
   // nodes list storing only id
   nodes: Array<string>
   totalCount: number | null
   onPage: number
   pageNumber: number
   readonly maxPageNumber: number | null

   // NodesProducerReference
   'nodes producer': EventProducer<Array<any>> | null

   // ListItemGetterReference
   'list item getter': ListItemGetter | null
   // ListItemSetterReference
   'list item setter': ListItemSetter | null
}

export interface ListProducer<T> {
   readonly nodes: Array<T>
   readonly totalCount: number | null
   onPage: number
   pageNumber: number
   readonly maxPageNumber: number | null
}

export interface OnChangeCallback {
   (event: ModelEvent<any>): void
}

export interface IDatabaseModelProducerStore<
   T extends Producerable<any> = any,
   TP extends DatabaseModelTypesToPayloadsMap<any, any> = any
> extends IProducerStore<T, TP>{
   excludeProperties?: Array<string | RegExp>
   // TODO: possible every database store must have schema
   schema?: AosSchema
   dispatcher: DatabaseDispatcher<IDatabaseModelProducerStore<T, TP>, ModelPropertyKey, TP>
   onChange?: OnChangeCallback
}

/**
 * Will assign schema to store, if it not exists.
 * Use schema from parent schema field, if it exists
 * */
export const setupSchema = (store: IProducerStore<any, any>) => {
  const databaseStore = store as IDatabaseModelProducerStore<any, any>
  if (databaseStore.schema)
    return

  // need link parent schema field
  // to new object field
  databaseStore.schema = getSchemaFromParentField(databaseStore) || {}
}

const getSchemaFromParentField = ({ parent }: IDatabaseModelProducerStore<any, any>): AosSchema | void => {
  if (!parent)
    return

  const { name, store: { schema: parentSchema } } = parent
  if (!parentSchema)
    return

  const relationsField = parentSchema[name]
  if (!relationsField || !(relationsField instanceof RelationsField))
    return

  return relationsField.schema
}

export interface DatabaseEventReducer<
   Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore,
   Payload = any,
   T = Producerable,
   Result = boolean | Promise<boolean | void> | void,
>
   extends EventReducer<Store, Payload, T, Result> {
}
