import { IDatabaseModelProducerStore, ListSource } from '@/lazyDB/database/types'
import { AosSchema } from '@/abstractObjectSchema'
import {
  ModelEvent,
  ModelEventGetPropertyPayload,
  ModelEventSetPropertyPayload,
  Producerable,
  ModelEventPayload,
  ModelTypesToPayloadsMap,
  ModelPropertyKey,
  ModelEventSuccessPayload,
  ModelEventFailurePayload
} from '../core/types'
import { DatabaseEventsPayloads } from './dispatcher'

// ModelEventTypes extends EventType,
// but currently ts not allow this behavior
export enum ModelEventTypes {
   GetProperty = 'GetProperty',
   Read = 'Read',

   SetProperty = 'SetProperty',
   ValidationFailure = 'ValidationFailure',
   Update = 'Update',

   New = 'New',
   Create = 'Create',

   DeleteProperty = 'DeleteProperty',
   Delete = 'Delete',

   Success = 'Success',
   Failure = 'Failure'
}

export type DatabaseModelTypesToPayloadsMap<
   Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore,
   Key extends ModelPropertyKey = ModelPropertyKey
> = ModelTypesToPayloadsMap<Store, Key> & {
   [type: string]: any
   [ModelEventTypes.Read]: ModelEventReadPayload<Store>
   [ModelEventTypes.Success]: ModelEventSuccessPayload<Store, any>
   [ModelEventTypes.Failure]: ModelEventFailurePayload<Store, any>
}

export enum AsyncConnectorEventTypes {
   Read = 'Read',
   Update = 'Update',
   Create = 'Create',
   Delete = 'Delete',
}

export interface DatabaseModelPayload<Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>
   extends ModelEventPayload<Store> {
}

export interface ModelEventReadPayload<Store extends IDatabaseModelProducerStore<any, any> = IDatabaseModelProducerStore>
   extends DatabaseModelPayload<Store> {
   gets: Array<ModelEvent<ModelEventGetPropertyPayload>>
   sets: Array<ModelEvent<ModelEventSetPropertyPayload>>
}
