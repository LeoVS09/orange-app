import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'

@Component
export default class ReactiveUpdate extends Vue {
   public reactive = 1
}

export function reactiveUpdate(vm: Vue, force?: boolean) {
  // @ts-ignore
  const { reactive } = vm

  return () => {
    if (force) {
      vm.$forceUpdate()
      return
    }
    // @ts-ignore
    vm.reactive++
  }
}
