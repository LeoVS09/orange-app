<template>
  <div class="list-column">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Mixins,
  Inject
} from 'vue-property-decorator'
import SlotValue from '@/components/mixins/SlotValue'
import { AddHeaderMethod } from '../components/types'

@Component
export default class ListColumn extends Mixins(SlotValue) {
  @Prop(String)
  name?: string;

  get propertyKey() {
    if (this.name)
      return this.name

    return this.slotValue()
  }

  @Inject()
  addHeader!: AddHeaderMethod

  mounted() {
    const key = this.propertyKey
    const label = this.slotValue()

    if (!key || !label)
      return

    this.addHeader({
      key,
      label,
      expand: false
    })
  }
}
</script>

<style lang="scss">
</style>
