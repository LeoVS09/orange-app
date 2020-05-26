import { PluginFunction } from 'vue'
import { Producerable } from './core/types'

export interface ILazyDBFilters {
  [key: string]: (model: Producerable) => boolean
}

const filters: ILazyDBFilters = {
  isReading: (model: Producerable) => false,
  isHaveReadingError: (model: Producerable) => false,

  isNew: (model: Producerable) => false,
  isCreating: (model: Producerable) => false,
  isHaveCreatingError: (model: Producerable) => false,

  isChanged: (model: Producerable) => false,
  isUpdating: (model: Producerable) => false,
  isHaveUpdatingError: (model: Producerable) => false,

  isDeleting: (model: Producerable) => false,
  isHaveDeletingError: (model: Producerable) => false,

  // mix of isReading, isUpdating, isCreating, isDeleting
  isPending: (model: Producerable) => false,
  // mix errors on reading, updating, creating, deleting
  isHaveError: (model: Producerable) => false,

  // model not changed, and not in process
  isSynced: (model: Producerable) => true
}

export const LazyDBFilters: PluginFunction<any> = Vue => {
  for (const key of Object.keys(filters)) {
    Vue.prototype[`$${key}`] = filters[key]
    Vue.filter(key, filters[key])
  }
}
