import { PluginFunction } from 'vue'
import { AbstractData } from './core/types'

export interface ILazyDBFilters {
  [key: string]: (model: AbstractData) => boolean
}

const filters: ILazyDBFilters = {
  isReading: (model: AbstractData) => false,
  isHaveReadingError: (model: AbstractData) => false,

  isNew: (model: AbstractData) => false,
  isCreating: (model: AbstractData) => false,
  isHaveCreating: (model: AbstractData) => false,

  isChanged: (model: AbstractData) => false,
  isUpdating: (model: AbstractData) => false,
  isHaveUpdatingError: (model: AbstractData) => false,

  isDeleting: (model: AbstractData) => false,
  isHaveDeletingError: (model: AbstractData) => false,

  // mix of isReading, isUpdating, isCreating, isDeleting
  isProcessing: (model: AbstractData) => false,
  // mix errors on reading, updating, creating, deleting
  isHaveError: (model: AbstractData) => false,

  // model not changed, and not in process
  isSynced: (model: AbstractData) => true
}

export const LazyDBFilters: PluginFunction<any> = Vue => {
  Vue.prototype.$isReading = (model: AbstractData) => false
  Vue.filter('isReading', (model: AbstractData, property?: string) => false)

  for (const key of Object.keys(filters)) {
    Vue.prototype[`$${key}`] = filters[key]
    Vue.filter(key, filters[key])
  }
}
