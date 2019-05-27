import Vue from 'vue'
import {Component, Prop, Mixins} from 'vue-property-decorator'
import Loadable from "@/components/mixins/loadable";

@Component
export default class ModelById extends Loadable {
   @Prop({
      type: String,
      required: true
   })
   id: string

   modelById: (id: string) => any

   get model(): any | undefined {
      if(!this.modelById)
         return

      return this.modelById(this.id)
   }

   loadModel: (id: string) => Promise<boolean>

   isLoadingOverride = true
   loadAction() {
      return this.loadModel(this.id)
   }
}
