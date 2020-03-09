import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

export const loadEvent = 'load'

@Component
export default class Loadable extends Vue {
   @Prop({
     type: Function
   })
   public load!: () => Promise<boolean>

   // By this property and method can override loading action
   public isLoadingOverride = false

   public isLoading = false

   public isErrorLoading = false

   public async loadAction(): Promise<boolean> {
     return this.load()
   }

   public created() {
     this.tryLoad()
   }

   public async tryLoad() {
     if (!this.load && !this.isLoadingOverride)
       return

     this.isLoading = true
     this.isErrorLoading = false

     if (await this.loadAction()) {
       this.$emit(loadEvent, true)
       this.isLoading = false
       return
     }

     this.isLoading = false
     this.isErrorLoading = true

     this.$emit(loadEvent, false)
   }
}
