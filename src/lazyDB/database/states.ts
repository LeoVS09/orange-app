import {
  ModelEvent, StateResolver, ModelEventFailurePayload, ModelEventSuccessPayload, isFailureEvent, isSuccessEvent
} from '../core/types'
import { ModelEventTypes } from './events'

/**
 * is model have at least one event given type,
 * returns state resolver, which receive memory
 * @param type - expected event type in memory
 */
export const isHaveEventInMemory: (...types: Array<ModelEventTypes>) => StateResolver<ModelEvent<any>> = (...types) =>
  memory => memory.some(event => types.includes(event.type as ModelEventTypes))

export const isHaveFailureOfEventInMemory: (...types: Array<ModelEventTypes>) => StateResolver<ModelEvent<any>> = (...types) =>
  memory => memory.some(event => {
    if (!isFailureEvent(event))
      return false

    // Check if it was failure of given event
    return types.includes(event.payload.event.type)
  })

export const isHaveSuccessOfEventInMemory: (...types: Array<ModelEventTypes>) => StateResolver<ModelEvent<any>> = (...types) =>
  memory => memory.some(event => {
    if (!isSuccessEvent(event))
      return false

    // Check if it was success of given event
    return types.includes(event.payload.event.type)
  })

export const isReading = isHaveEventInMemory(ModelEventTypes.Read)
export const isHaveReadingError = isHaveFailureOfEventInMemory(ModelEventTypes.Read)

export const isChanged = isHaveEventInMemory(ModelEventTypes.SetProperty, ModelEventTypes.DeleteProperty)
export const isHaveValidationError = isHaveEventInMemory(ModelEventTypes.ValidationFailure)
export const isUpdating = isHaveEventInMemory(ModelEventTypes.Update)
export const isHaveUpdatingError = isHaveFailureOfEventInMemory(ModelEventTypes.Update)

/**
 * Is model newly created object (draft)
 * adn not was saved
 */
export const isNew = isHaveEventInMemory(ModelEventTypes.New)
export const isCreating = isHaveEventInMemory(ModelEventTypes.Create)
export const isHaveCreatingError = isHaveFailureOfEventInMemory(ModelEventTypes.Create)

export const isDeleting = isHaveEventInMemory(ModelEventTypes.Delete)
export const isHaveDeletingError = isHaveFailureOfEventInMemory(ModelEventTypes.Delete)
export const isDeleted = isHaveSuccessOfEventInMemory(ModelEventTypes.Delete)

/**
 * Model in process of reading, or creating, or updating, or deleting
 */
export const isPending: StateResolver<ModelEvent<any>> = memory =>
  isReading(memory)
  || isCreating(memory)
  || isUpdating(memory)
  || isDeleting(memory)

/**
 * is have any type of error (read, create, update, delete) or validation error
 */
export const isHaveError: StateResolver<ModelEvent<any>> = memory =>
  isHaveReadingError(memory)
  || isHaveCreatingError(memory)
  || isHaveUpdatingError(memory)
  || isHaveDeletingError(memory)
  || isHaveValidationError(memory)

/**
 *  model not changed, and not in process
 */
export const isSynced: StateResolver<ModelEvent<any>> = memory =>
  !isChanged(memory) && !isPending(memory)
