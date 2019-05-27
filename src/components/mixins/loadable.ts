import Vue from 'vue'
import {Component, Prop} from 'vue-property-decorator'

export const loadEvent = 'load'

@Component
export default class Loadable extends Vue {
   @Prop({
      type: Function
   })
   load: () => Promise<boolean>

   // By this property and method can override loading action
   isLoadingOverride = false
   async loadAction(): Promise<boolean> {
      return this.load()
   }

   isLoading = false
   isErrorLoading = false

   created(){
      this.tryLoad()
   }

   async tryLoad() {
      if(!this.load && !this.isLoadingOverride)
         return

      this.isLoading = true
      this.isErrorLoading = false

      if(await this.loadAction()) {
         this.$emit(loadEvent, true)
         this.isLoading = false
         return
      }

      this.isLoading = false
      this.isErrorLoading = true

      this.$emit(loadEvent, false)
   }
}
