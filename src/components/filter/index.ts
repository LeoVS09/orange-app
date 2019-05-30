import {PluginFunction} from "vue";
import {formatDate, isDate} from "@/components/utils";

const Filters: PluginFunction<any> = Vue => {
   Vue.filter('formatDate', function (value: any) {
      if (!isDate(value))
         return value

      return formatDate(value)
   })
}

export default Filters
