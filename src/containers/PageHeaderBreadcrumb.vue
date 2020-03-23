<template>
   <div class="breadcrumbs">
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
import { randomId } from '@/components/utils'
import { Header, Breadcrumb, AddBreadcrumbMethod } from '../components/types'

@Component
export default class PageHeaderBreadcrumb extends Mixins(SlotValue) {
      parentIdKey = 'pageHeaderId'

      @Prop(Object)
      to?: object

      breadcrumbId = 'default'

      created() {
        this.breadcrumbId = `breadcrumb-${randomId()}`
      }

      mounted() {
        this.setBreadcrumbs()
      }

      updated() {
        this.setBreadcrumbs()
      }

      @Inject()
      addBreadcrumb!: AddBreadcrumbMethod

      setBreadcrumbs() {
        const link = this.to
        const label = this.slotValue()

        if (!label)
          return

        this.addBreadcrumb({
          id: this.breadcrumbId,
          label,
          link
        })
      }
}
</script>

<style lang="scss">

</style>
