import {ModelAttributeType} from "@/lazyDB/core/types";
import {SymFor} from "@/lazyDB/core/utils";

export type ChangeCallback = () => void

export interface ModelReadSchemaField {
   type: ModelAttributeType
   fields: ModelReadSchema
}

export interface ModelReadSchema {
   [key: string]: ModelAttributeType | ModelReadSchemaField
}

export const ModelObserverReference = SymFor('model observer')
export const ListViewObserverReference = SymFor('list view observer')
export const ModelEventDispatcherReference = SymFor('event dispatcher')
export const ModelStateMemoryReference = SymFor('state memory')
export const ModelEventHandlerReference = SymFor('event handler')



