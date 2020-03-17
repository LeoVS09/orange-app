import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import Loadable from '@/components/mixins/loadable'

@Component
export default class ChildValue extends Vue {
   public parentIdKey?: string

   get owner() {
     let parent = this.$parent

     const haveId = (el: Vue) => {
       if (!this.parentIdKey)
         return true

       // @ts-ignore
       return el[this.parentIdKey]
     }

     while (parent && !haveId(parent))
       parent = parent.$parent

     return parent
   }

   public slotValue(): string | null {
     const slot = this.$slots.default && this.$slots.default[0]

     if (!slot)
       return null

     const { text } = slot
     if (!text)
       return null

     return text
   }
}
