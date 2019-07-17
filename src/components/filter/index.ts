import {PluginFunction} from 'vue';
import {formatDate, isDate} from '@/components/utils';

const Filters: PluginFunction<any> = (Vue) => {
   Vue.filter('formatDate', function(value: any) {
      if (!isDate(value)) {
         return value;
      }

      return formatDate(value);
   });

   Vue.filter('capitalise', function(value: any) {
      if (typeof value !== 'string') {
         return value;
      }

      return capitalise(value);
   });
};

export default Filters;

function capitalise(s: string): string {
   return s[0].toUpperCase() + s.slice(1);
}
