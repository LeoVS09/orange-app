import { PluginFunction } from 'vue'
import { Producerable, StateResolver, ModelEvent } from './core/types'
import { getStore } from './core/common'
import * as state from './database/states'

export interface ILazyDBFilters {
  [key: string]: (model: Producerable) => boolean
}

export type ModelStateResolverFactory = (resolver: StateResolver<ModelEvent<any>>, fallback?: boolean) => (model: Producerable) => boolean

/** Wrap state resolver, to resolve state of Producerable */
export const resolveModelState: ModelStateResolverFactory = (resolver, fallback = false) =>
  model => {
    if (!model)
      return fallback

    const store = getStore(model)
    if (!store)
      return fallback

    const { memory } = store
    if (!memory)
      return fallback

    return resolver(memory)
  }

const filters: ILazyDBFilters = {
  isReading: resolveModelState(state.isReading),
  isHaveReadingError: resolveModelState(state.isHaveReadingError),

  isNew: resolveModelState(state.isNew),
  isCreating: resolveModelState(state.isCreating),
  isHaveCreatingError: resolveModelState(state.isHaveCreatingError),

  isChanged: resolveModelState(state.isChanged),
  isUpdating: resolveModelState(state.isUpdating),
  isHaveUpdatingError: resolveModelState(state.isHaveUpdatingError),

  isDeleting: resolveModelState(state.isDeleting),
  isHaveDeletingError: resolveModelState(state.isHaveDeletingError),

  // mix of isReading, isUpdating, isCreating, isDeleting
  isPending: resolveModelState(state.isPending),
  // mix errors on reading, updating, creating, deleting
  isHaveError: resolveModelState(state.isHaveError),

  // model not changed, and not in process
  isSynced: resolveModelState(state.isSynced, true)
}

export const LazyDBFilters: PluginFunction<any> = Vue => {
  for (const key of Object.keys(filters)) {
    Vue.prototype[`$${key}`] = filters[key]
    Vue.filter(key, filters[key])
  }
}
