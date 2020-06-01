<template>
  <div class="model-property">{{propertyKey}}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component, Mixins, Prop, Inject
} from 'vue-property-decorator'
import SlotValue from '@/components/mixins/SlotValue'
import { SetLazyPropertyDataMethod } from '@/components/types'

@Component
export default class LazyProperty extends Mixins(SlotValue) {
  @Prop(String)
  name?: string;

  get propertyKey() {
    if (this.name)
      return this.name

    return this.slotValue()
  }

  @Inject()
  setProperty!: SetLazyPropertyDataMethod;

  mounted() {
    const key = this.propertyKey
    const label = this.slotValue()

    if (!key || !label)
      return

    this.setProperty({ key, label })
  }
}
</script>
