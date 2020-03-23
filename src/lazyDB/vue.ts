import { PluginFunction } from 'vue'

export const LazyDBFilters: PluginFunction<any> = Vue => {
  Vue.prototype.$isReading = () => {
  }

  Vue.filter('isReading', (value: any, property?: string) => false)
  // const result = isReading(value, property)
  // console.log('is reading', result)
  // return result
}
