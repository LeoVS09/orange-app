import { ModelEvent, StateResolver } from '../core/types'
import { ModelEventTypes } from './events'

/**
 * is model have at least one event given type,
 * returns state resolver, which receive memory
 * @param type - expected event type in memory
 */
export const isHaveEventInMemory: (type: ModelEventTypes) => StateResolver<ModelEvent<any>> = type =>
  memory => memory.some(event => event.type === type)

export const isReading = isHaveEventInMemory(ModelEventTypes.Read)
export const isHaveReadingError = isHaveEventInMemory(ModelEventTypes.ReadFailure)

export const isChanged = isHaveEventInMemory(ModelEventTypes.SetProperty)
export const isHaveValidationError = isHaveEventInMemory(ModelEventTypes.ValidationFailure)
export const isUpdating = isHaveEventInMemory(ModelEventTypes.Update)
export const isHaveUpdatingError = isHaveEventInMemory(ModelEventTypes.UpdateFailure)

/**
 * Is model newly created object (draft)
 * adn not was saved
 */
export const isNew = isHaveEventInMemory(ModelEventTypes.New)
export const isCreating = isHaveEventInMemory(ModelEventTypes.Create)
export const isHaveCreatingError = isHaveEventInMemory(ModelEventTypes.CreateFailure)

export const isDeleting = isHaveEventInMemory(ModelEventTypes.Delete)
export const isHaveDeletingError = isHaveEventInMemory(ModelEventTypes.DeleteFailure)
export const isDeleted = isHaveEventInMemory(ModelEventTypes.DeleteSuccess)

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
