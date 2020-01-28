import {
  AbstractData,
  EventProducer,
  IProducerStore,
  ModelEvent,
} from '@/lazyDB/core/types'
import { AsyncConnectorEventTypes, ModelEventReadPayload } from '@/lazyDB/database/events'

import { SymFor } from '@/lazyDB/core/utils'
import { DatabaseDispatcher } from '@/lazyDB/database/dispatcher'
import {
  AosEntitySchemaStorage, AosEntitySchema, AosSchema, AosFieldType,
} from '@/abstractObjectScheme'

export type AsyncConnectorReducer<T, R> = (store: IProducerStore, event: T) => Promise<R>

export interface AsyncConnectorReducersMap {
   [key: string]: AsyncConnectorReducer<any, any>
   [AsyncConnectorEventTypes.Read]: AsyncConnectorReducer<ModelEventReadPayload, any>
}

export type DatabaseTableMap = Map<string, AbstractData | EventProducer>
export type DatabaseStorageMap = Map<string, DatabaseTableMap>

export interface DatabaseTable {
   [id: string]: AbstractData | EventProducer
}

export interface DatabaseStorage {
   [entity: string]: DatabaseTable
}

export interface ILazyReactiveDatabase {
   storage: DatabaseStorage
   schemas: AosEntitySchemaStorage
   findOne: (entity: string, id: string, wrapped?: boolean) => AbstractData | undefined
   set: (entity: string, id: string, data: AbstractData | EventProducer) => void
   update: (entity: string, id: string, data: AbstractData) => boolean
   add: (entity: string, id: string, data: AbstractData) => void
   getSchemaByKey: (key: string, type: AosFieldType) => AosEntitySchema | undefined
   setSchema: (entity: string, schema: AosEntitySchema) => void
   excludeProperties: Array<string>
}

export const ListItemGetterReference = SymFor('list item getter') as 'list item getter'
export const ListItemSetterReference = SymFor('list item setter') as 'list item setter'
export const nodesKey = 'nodes'
export const NodesProducerReference = SymFor(`${nodesKey} producer`) as 'nodes producer'

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
   'nodes producer': IProducerStore<Array<any>> | null

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

export interface IDatabaseModelProducerStore extends IProducerStore {
   excludeProperties?: Array<string>
   readSchema?: AosSchema
   dispatcher: DatabaseDispatcher
   onChange?: OnChangeCallback
}
