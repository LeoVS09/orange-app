<template>
   <Section
      class="model-info"
      without-margin
      border-bottom
   >
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

   function normaliseName(key: string): string {
      return key.slice(0,1).toUpperCase() + (key.slice(1).split('').map(c => {
         if(c.match(/[A-Z]/))
            return ' ' + c.toLowerCase()

         return c
      }).join(''))
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
      value: {[key: string]: any}

      @Prop({
         type: Boolean,
         default: false
      })
      editable: boolean


      @Prop({
         type: Array,
         default: () => [
            'id',
            'nodeId',
            'name',
            'createdAt',
            'updatedAt'
         ]
      })
      excludeDefaults: Array<string>

      @Prop({
         type: Array,
         default: () => []
      })
      exclude: Array<string>

      get mainData() {
         let keys = Object.keys(this.value)
         const exclude = [...this.excludeDefaults, ...this.exclude]

         keys = keys.filter(k =>
            k[0] !== '_' &&
            exclude.indexOf(k) === -1
         )

         let result: {[key: string]: any} = {}

         for(const key of keys) {
            const value = this.value[key]
            if(typeof value === 'object')
               continue

            const label = normaliseName(key)

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
