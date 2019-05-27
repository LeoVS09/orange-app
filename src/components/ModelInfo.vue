<template>
   <Section
      class="model-info"
      without-margin
      border-bottom
   >
      <div class="model-info--top-data">
         <data-view
            in-row
            :compact="false"
            :values="topDataValues"
            :icons="topDataIcons"
            :order="topDataOrder"
         />
      </div>

      <div class="model-info--main">
         <h4 class="model-info--header">Information</h4>
         <data-view
            model-info
            :values="mainData"
         />
      </div>

   </Section>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import Section from './Section.vue'
   import DataView from './DataView.vue'

   export interface IModelInfoTopData {
      [key: string]: string | {
         text: string,
         icon: string
      }
   }

   @Component({
      components: {
         Section,
         DataView
      }
   })
   export default class ModelInfo extends Vue {

      @Prop({
         type: Object,
         required: true
      })
      model: {[key: string]: any}

      @Prop({
         type: Boolean,
         default: false
      })
      editable: boolean

      @Prop({
         type: Array,
         default: () => [
            { 'createdAt': 'Created'},
            { 'updatedAt': 'Modified'}
         ]
      })
      topData: Array<IModelInfoTopData>

      @Prop({
         type: Array,
         default: () => [
            'id',
            'nodeId',
            'name'
         ]
      })
      excludeMainData: Array<string>

      get topDataValues(){
         let result: {[key: string]: any} = {}

         this.topData.forEach(prop => {
            const key = Object.keys(prop)[0]
            const value = prop[key]
            if(typeof value === 'string')
               return result[value] = this.model[key]

            return result[value.text] = this.model[key]
         })

         return result
      }

      get topDataOrder(){
         return this.topData.map(prop => {
            return prop[Object.keys(prop)[0]]
         })
      }

      get topDataIcons(){
         let result: {[key: string]: string} = {}

         this.topData.forEach(prop => {
            const key = Object.keys(prop)[0]
            const value = prop[key]
            if(typeof value === 'string')
               return

            result[value.text] = value.icon
         })

         return result
      }

      get topDataKeys(){
         return this.topData.map(prop =>
            Object.keys(prop)[0]
         )
      }

      get mainData() {
         let keys = Object.keys(this.model)
         const topDataKeys = this.topDataKeys
         keys = keys.filter(k =>
            k[0] !== '_' &&
            this.excludeMainData.indexOf(k) === -1 &&
            topDataKeys.indexOf(k) === -1
         )

         let result: {[key: string]: any} = {}

         for(const key of keys) {
            const value = this.model[key]
            if(typeof value === 'object')
               continue

            const label = key.slice(0,1).toUpperCase() + key.slice(1)

            result[label] = value
         }

         return result
      }
   }
</script>

<style lang="scss">
   .model-info {

      &--header {
         margin-bottom: 4rem;
      }
   }
</style>
