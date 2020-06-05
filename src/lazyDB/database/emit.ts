import { EventProducer, isSetEvent } from '../core/types'
import { emit } from '../core/emit'
import {
  ModelEventTypes,
  ModelEventUpdatePayload,
  ModelEventCreatePayload,
  ModelEventDeletePayload
} from './events'
import { getStore } from '../core/common'

/** Emit update event on model */
export const emitUpdate = (producer: EventProducer<any> | any) => {
  const store = getStore(producer)
  if (!store) {
    console.error('Cannot emit update event on not producer')
    return
  }

  const { memory } = store
  if (!memory) {
    console.error('Cannot emit update event on producer without memory')
    return
  }

  const sets = memory.filter(isSetEvent)
  if (!sets.length) {
    console.error('Cannot emit update event on producer without changes')
    return
  }

  const payload: ModelEventUpdatePayload<any> = {
    store,
    sets
  }
  emit(producer, ModelEventTypes.Update, payload)
}

/** Emit create event on model */
export const emitCreate = (producer: EventProducer<any> | any) => {
  const store = getStore(producer)
  if (!store) {
    console.error('Cannot emit create event on not producer')
    return
  }
  const payload: ModelEventCreatePayload<any> = {
    store
  }
  emit(producer, ModelEventTypes.Create, payload)
}

/** Emit delete event on model */
export const emitDelete = (producer: EventProducer<any> | any) => {
  const store = getStore(producer)
  if (!store) {
    console.error('Cannot emit create event on not producer')
    return
  }
  const payload: ModelEventDeletePayload<any> = {
    store
  }
  emit(producer, ModelEventTypes.Delete, payload)
}

