import {
   ModelEvent,
   ModelEventGetPropertyPayload,
   ModelEventSetPropertyPayload,
   AbstractData,
   ModelEventPayload,
} from '../core/types'
import { ModelReadSchema} from '@/lazyDB/types'
import { IDatabaseProducerStore, ListSource} from '@/lazyDB/database/types'


// ModelEventTypes extends EventType,
// but currently ts not allow this behavior
export enum ModelEventTypes {
   GetProperty = 'GetProperty',
   Read = 'Read',
   ReadSuccess = 'ReadSuccess',
   ReadFailure = 'ReadFailure',

   SetProperty = 'SetProperty',
   Update = 'Update',
   UpdateSuccess = 'UpdateSuccess',
   UpdateFailure = 'UpdateFailure',

   New = 'New',
   Create = 'Create',
   CreateSuccess = 'CreateSuccess',
   CreateFailure = 'CreateFailure',

   DeleteProperty = 'DeleteProperty',
   Delete = 'Delete',
   DeleteSuccess = 'DeleteSuccess',
   DeleteFailure = 'DeleteFailure',
}

export enum AsyncConnectorEventTypes {
   Read = 'Read',
   ErrorReading = 'ErrorReading',
   Update = 'Update',
   ErrorUpdated = 'ErrorUpdated',
   Create = 'Create',
   ErrorCreating = 'ErrorCreating',
   Delete = 'Delete',
   ErrorDeleting = 'ErrorDeleting',
}

export interface DatabaseModelPayload extends ModelEventPayload {
   store: IDatabaseProducerStore
}

export interface ReadEventPayload extends DatabaseModelPayload {
   readSchema: ModelReadSchema
   gets: Array<ModelEvent<ModelEventGetPropertyPayload>>
   sets: Array<ModelEvent<ModelEventSetPropertyPayload>>
}

export type ModelEventReadPayload = ReadEventPayload

export interface ReadSuccessEventPayload extends DatabaseModelPayload {
   data: AbstractData
}

export interface ReadFailureEventPayload<T extends Error = any> extends DatabaseModelPayload {
   error: T
}
