import {ModelAttributeType} from "./types";

export enum ModelEventType {
   GetProperty = "GetProperty",
   Read = "Read",
   ReadSuccess = "ReadSuccess",
   ErrorReading = "ErrorReading",

   SetProperty = "SetProperty",
   Update = "Update",
   UpdateSuccess = "UpdateSuccess",
   ErrorUpdated = "ErrorUpdated",

   New = "New",
   Create = "Create",
   CreateSuccess = "CreateSuccess",
   ErrorCreating = "ErrorCreating",

   Delete = "Delete",
   DeleteSuccess = "DeleteSuccess",
   ErrorDeleting = "ErrorDeleting",
}

export interface ModelEvent<T = any> {
   type: string
   date: number
   payload: T
}

export interface ModelEventSetPropertyPayload {
   name: string
   oldValue: string | null
   newValue: string
}

export interface ModelEventGetPropertyPayload {
   name: string
   type: ModelAttributeType
   inner?: ModelEventGetPropertyPayload
}

export interface ModelEventReadPayload {
   id: string
   gets: Array<ModelEvent<ModelEventGetPropertyPayload>>
}
