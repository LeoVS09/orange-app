<template>
   <div class="list-column">
      <slot></slot>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Header } from '../components/types'
import ChildValue from '@/components/mixins/ChildValue'

   @Component
export default class ListColumn extends Mixins(ChildValue) {
      @Prop(String)
      name?: string

      get propertyKey() {
        if (this.name)
          return this.name

        return this.slotValue()
      }

      parentIdKey = 'listId'

      mounted() {
        // @ts-ignore
        const headers = this.owner.headers as Array<Header>

        const key = this.propertyKey
        const label = this.slotValue()

        if (!key || !label)
          return

        if (headers.some(h => h.key === key))
          return

        headers.push({ key, label, expand: false })
      }
}
</script>

<style lang="scss">

</style>
