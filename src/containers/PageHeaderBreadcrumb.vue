<template>
   <div class="breadcrumbs">
      <slot></slot>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import {Header, Breadcrumb} from "../components/types";
   import ChildValue from '@/components/mixins/ChildValue'
   import {randomId} from "@/components/utils";

   @Component
   export default class PageHeaderBreadcrumb extends Mixins(ChildValue) {

      parentIdKey = 'pageHeaderId'

      @Prop(Object)
      to?: object

      breadcrumbId = 'default'

      created(){
         this.breadcrumbId = `breadcrumb-${randomId()}`
      }

      mounted(){
         this.setBreadcrumbs()
      }

      updated(){
         this.setBreadcrumbs()
      }

      setBreadcrumbs(){
         // @ts-ignore
         const breadcrumbs = this.owner.breadcrumbs as Array<Breadcrumb>

         const link = this.to
         const label = this.slotValue()

         if(!label)
            return;

         const have = breadcrumbs.find(b => b.id === this.breadcrumbId)
         if(!have)
            return breadcrumbs.push({
               id: this.breadcrumbId,
               label,
               link
            })

         if(have.label !== label)
            have.label = label

         if(JSON.stringify(have.link) !== JSON.stringify(link))
            have.link = link
      }

   }
</script>

<style lang="scss">

</style>
