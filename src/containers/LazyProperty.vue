<template>
   <div class="model-property">
      {{propertyKey}}
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'

   @Component
   export default class LazyProperty extends Vue {

      @Prop(String)
      name?: string

      get owner(){
         let parent = this.$parent;
         // @ts-ignore
         while (parent && !parent.lazyDataId)
            parent = parent.$parent;

         return parent;
      }

      get slotValue(): string | null {
         const slot = this.$slots.default && this.$slots.default[0]
         if(!slot)
            return null

         const {text} = slot
         if(!text)
            return null

         return text
      }

      get propertyKey(){
         if(this.name)
            return name

         return this.slotValue
      }

      mounted(){
         console.log('LazyProperty owner', this.owner)

         // @ts-ignore
         const { properties } = this.owner
         console.log('LazyProperty properties', properties)

         const key = this.propertyKey
         const label = this.slotValue
         console.log('LazyProperty', key, label)
         if(!key || !label)
            return

         this.$set(properties, key as string, label)
         console.log('LazyProperty properties 2', properties)
      }

   }
</script>
