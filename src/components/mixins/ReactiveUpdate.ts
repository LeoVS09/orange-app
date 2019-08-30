import Vue from 'vue'
import { Component, Prop, Mixins} from 'vue-property-decorator'

@Component
export default class ReactiveUpdate extends Vue {

   public reactive = 1

}

export function reactiveUpdate(vm: Vue) {
   // @ts-ignore
   const reactive = vm.reactive

   return () => {
      // @ts-ignore
      vm.reactive++
   }
}
