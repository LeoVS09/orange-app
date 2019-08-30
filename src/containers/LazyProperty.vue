<template>
   <div class="model-property">
      {{propertyKey}}
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins, Prop } from 'vue-property-decorator'
import ChildValue from '@/components/mixins/ChildValue'

   @Component
export default class LazyProperty extends Mixins(ChildValue) {
      @Prop(String)
      name?: string

      get propertyKey() {
        if (this.name)
          return this.name

        return this.slotValue()
      }

      parentIdKey = 'lazyDataId'

      mounted() {
        // @ts-ignore
        const { properties } = this.owner

        const key = this.propertyKey
        const label = this.slotValue()

        if (!key || !label)
          return

        this.$set(properties, key as string, label)
      }
}
</script>
