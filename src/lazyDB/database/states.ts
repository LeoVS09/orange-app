import { ModelEvent, StateResolver} from '../core/types'
import { ModelEventTypes} from './events'

export const isReading: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) => type === ModelEventTypes.Read)

export const isUpdating: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) => type === ModelEventTypes.Update)

export const isNew: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) => type === ModelEventTypes.New)

export const isCreate: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) => type === ModelEventTypes.Create)

export const isDeleting: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) =>
      type === ModelEventTypes.DeleteProperty ||
      type === ModelEventTypes.Delete,
   )

export const isDeleted: StateResolver<ModelEvent<any>> = ({ memory }) =>
   memory.some(({ type }) => type === ModelEventTypes.DeleteSuccess)
