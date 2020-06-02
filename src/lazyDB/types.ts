import { SymFor } from '@/lazyDB/core/utils'

export type ChangeCallback = () => void

export const ModelObserverReference = SymFor('model observer')
export const ListViewObserverReference = SymFor('list view observer')
export const ModelEventDispatcherReference = SymFor('event dispatcher')
export const ModelStateMemoryReference = SymFor('state memory')
export const ModelEventHandlerReference = SymFor('event handler')
