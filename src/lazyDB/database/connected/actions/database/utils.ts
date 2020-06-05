import { IProducerStore, ModelEvent } from '@/lazyDB/core/types'

export const removeEventsFromMemory = (store: IProducerStore, events: Array<ModelEvent>) => {
  const { memory } = store

  if (memory)
    memory.forget(...events)
}

export const isObject = (value: any): value is Object => typeof value === 'object'
export const isDate = (value: any): value is Date => value instanceof Date
