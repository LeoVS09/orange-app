import {AbstractData, EventProducer, IProducerStore, ModelAttributeType} from "@/lazyDB/core/types";
import {AsyncConnectorEventTypes, ModelEventReadPayload} from "@/lazyDB/database/events";

import {SymFor} from "@/lazyDB/core/utils";

export interface AsyncConnectorReducer<T, R> {
   (store: IProducerStore, event: T): Promise<R>
}

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

export interface IEntityTypeSchema {
   [key: string]: ModelAttributeType
}

export interface IEntityTypeSchemaStorage {
   [entity: string]: IEntityTypeSchema
}

export interface ILazyReactiveDatabase {
   storage: DatabaseStorage
   schemas: IEntityTypeSchemaStorage
   findOne: (entity: string, id: string, wrapped?: boolean) => AbstractData | undefined
   set: (entity: string, id: string, data: AbstractData | EventProducer) => void
   update: (entity: string, id: string, data: AbstractData) => boolean
   add: (entity: string, id: string, data: AbstractData) => void
   getSchemaByKey: (key: string, type: ModelAttributeType) => IEntityTypeSchema | undefined
}

export const ListItemGetterReference = SymFor('list item getter') as 'list item getter'

export interface ListItemGetter {
   (source: ListSource, index: number): any
}

export interface ListSource {
   // nodes list storing only id
   nodes: Array<string>
   totalCount: number | null
   onPage: number
   pageNumber: number
   readonly maxPageNumber: number | null

   'list item getter': ListItemGetter| null
}

export interface ListProducer<T> {
   readonly nodes: Array<T>
   readonly totalCount: number | null
   onPage: number
   pageNumber: number
   readonly maxPageNumber: number | null
}