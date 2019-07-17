import {PluginFunction} from "vue";
import {isReading} from "./ModelObserver";

export const LazyDBFilters: PluginFunction<any> = Vue => {
   Vue.prototype.$isReading = isReading

   Vue.filter('isReading', function (value: any, property?: string) {
      const result = isReading(value, property)
      console.log('is reading', result)
      return result
   })
}
