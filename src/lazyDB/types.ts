import {ModelAttributeType} from "@/lazyDB/core/types";
import {SymFor} from "@/lazyDB/core/utils";

export type ChangeCallback = () => void

export interface ModelSchemaField {
   type: ModelAttributeType
   fields: ModelSchema
}

export interface ModelSchema {
   [key: string]: ModelAttributeType | ModelSchemaField
}


export const ModelObserverReference = SymFor('model observer')
export const ListViewObserverReference = SymFor('list view observer')
export const ModelEventDispatcherReference = SymFor('event dispatcher')
export const ModelStateMemoryReference = SymFor('state memory')
export const ModelEventHandlerReference = SymFor('event handler')



