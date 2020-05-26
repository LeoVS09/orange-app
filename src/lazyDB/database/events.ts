import { IDatabaseModelProducerStore, ListSource } from '@/lazyDB/database/types'
import { AosSchema } from '@/abstractObjectSchema'
import {
  ModelEvent,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  Producerable,
  ModelEventPayload,
  ModelTypesToPayloadsMap,
  ModelPropertyKey
} from '../core/types'
import { DatabaseEventsPayloads } from './dispatcher'

// ModelEventTypes extends EventType,
// but currently ts not allow this behavior
export enum ModelEventTypes {
   GetProperty = 'GetProperty',
   Read = 'Read',
   ReadSuccess = 'ReadSuccess',
   ReadFailure = 'ReadFailure',

   SetProperty = 'SetProperty',
   ValidationFailure = 'ValidationFailure',
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

export type DatabaseModelTypesToPayloadsMap<
   Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey
> = ModelTypesToPayloadsMap<Store, Key> & {
   [type: string]: any
   [ModelEventTypes.Read]: ModelEventReadPayload<Store>
   [ModelEventTypes.ReadSuccess]: ReadSuccessEventPayload<Store>
   [ModelEventTypes.ReadFailure]: ReadFailureEventPayload<Store>
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

export interface DatabaseModelPayload<Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>
   extends ModelEventPayload<Store> {
}

export interface ModelEventReadPayload<Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>
   extends DatabaseModelPayload<Store> {
   gets: Array<ModelEvent<ModelEventGetPropertyPayload>>
   sets: Array<ModelEvent<ModelEventSetPropertyPayload>>
}

export interface ReadSuccessEventPayload<Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>
   extends DatabaseModelPayload<Store> {
   data: Store['base']
   readPayload: ModelEventReadPayload<Store>
}

export interface ReadFailureEventPayload<
   Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore,
   T extends Error = any
> extends DatabaseModelPayload<Store> {
   error: T,
   readPayload: ModelEventReadPayload<Store>,
}
