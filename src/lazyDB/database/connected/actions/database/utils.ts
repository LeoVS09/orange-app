import { ModelEventReadPayload } from '@/lazyDB/database/events'

export const removeGetEventsFromMemory = ({ store, gets }: ModelEventReadPayload) => {
  const { memory } = store

  if (memory)
    memory.forget(...gets)
}

export const isObject = (value: any): value is Object => typeof value === 'object'
export const isDate = (value: any): value is Date => value instanceof Date
