import {ModelEvent, ModelEventGetPropertyPayload, ModelEventSetPropertyPayload, AbstractData} from '../core/types'
import {ModelReadSchema} from '@/lazyDB/types'
import {ListSource} from '@/lazyDB/database/types'


// ModelEventTypes extends EventType,
// but currently ts not allow this behavior
export enum ModelEventTypes {
   GetProperty = 'GetProperty',
   Read = 'Read',
   ReadSuccess = 'ReadSuccess',
   ErrorReading = 'ErrorReading',

   SetProperty = 'SetProperty',
   Update = 'Update',
   UpdateSuccess = 'UpdateSuccess',
   ErrorUpdated = 'ErrorUpdated',

   New = 'New',
   Create = 'Create',
   CreateSuccess = 'CreateSuccess',
   ErrorCreating = 'ErrorCreating',

   DeleteProperty = 'DeleteProperty',
   Delete = 'Delete',
   DeleteSuccess = 'DeleteSuccess',
   ErrorDeleting = 'ErrorDeleting',
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

export interface ReadEventPayload<T> {
   schema: ModelReadSchema
   current: T
   next: T
   gets: Array<ModelEvent<ModelEventGetPropertyPayload>>
   sets: Array<ModelEvent<ModelEventSetPropertyPayload>>
}

export type ModelEventReadPayload = ReadEventPayload<AbstractData>

export type ListEventReadPayload = ReadEventPayload<ListSource>
