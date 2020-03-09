import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import Loadable from '@/components/mixins/loadable'

@Component
export default class ModelById extends Loadable {
   @Prop({
     type: String,
     required: true
   })
   public id!: string

   public modelById!: (id: string) => any

   get model(): any | undefined {
     if (!this.modelById)
       return

     return this.modelById(this.id)
   }

   public loadModel!: (id: string) => Promise<boolean>

   public isLoadingOverride = true

   public loadAction() {
     return this.loadModel(this.id)
   }
}
