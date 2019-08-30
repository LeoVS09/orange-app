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
import { Component, Prop } from 'vue-property-decorator'
import Section from './Section.vue'
import DataView from './DataView.vue'

export interface IModelInfoTopData {
   [key: string]: string | {
      text: string,
      icon: string,
   };
}

function normaliseName(key: string): string {
  return key.slice(0, 1).toUpperCase() + (key.slice(1).split('').map((c) => {
    if (c.match(/[A-Z]/))
      return ` ${c.toLowerCase()}`

    return c
  }).join(''))
}

function isArrayOfObjects(arr: any[]): arr is Array<{[key: string]: string}> {
  return typeof arr[0] === 'object'
}

@Component({
  components: {
    Section,
    DataView,
  },
})
export default class ModelInfo extends Vue {
   @Prop({
     type: Object,
     required: true,
   })
   public value!: {[key: string]: any};

   @Prop({
     type: Boolean,
     default: false,
   })
   public editable!: boolean;

   @Prop(Array)
   public properties!: Array<string | {[key: string]: string}>;

   @Prop({
     type: Array,
     default: () => [
       'id',
       'nodeId',
       'name',
       'createdAt',
       'updatedAt',
     ],
   })
   public excludeDefaults!: string[];

   @Prop({
     type: Array,
     default: () => [],
   })
   public exclude!: string[];

   get mainData() {
     // TODO: refactor this, very bad code
     // NOTE: code !== sleep

     let keys: string[]
     const labels: {[key: string]: string} = {}

     if (!this.properties) {
       keys = Object.keys(this.value)
       const exclude = [...this.excludeDefaults, ...this.exclude]

       keys = keys.filter(k => k[0] !== '_'
            && exclude.indexOf(k) === -1)
     } else if (isArrayOfObjects(this.properties)) {
       keys = []

       this.properties.forEach((property) => {
         const key = Object.keys(property)[0]

         labels[key] = property[key]

         keys.push(key)
       })
     } else
       keys = this.properties as string[]

     if (!this.properties || typeof this.properties[0] !== 'object')
       keys.forEach(key => labels[key] = normaliseName(key))

     const result: {[key: string]: any} = {}

     for (const key of keys) {
       const value = this.value[key]
       if (typeof value === 'object')
         continue

       const label = labels[key]

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
