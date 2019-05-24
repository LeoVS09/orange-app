<template>
   <div :class="{
      'page-header': true,
      highlight,
      success: colorLine === ColorLineType.success,
      error: colorLine === ColorLineType.error,
      'text-width': textWidth,
      breadcrumbs
   }">
      <div class="page-header--breadcrumbs" v-if="breadcrumbs">
         <template v-for="step in visibleBreadcrumbs">
            <router-link
               v-if="step.link"
               class="page-header--breadcrumb-step link"
               :to="step.link"
            >{{step.name}}</router-link>
            <span
               v-else
               class="page-header--breadcrumb-step"
            >{{step.name}}</span>

            <span class="page-header--breadcrumb-separator">/</span>
         </template>
      </div>
      <input
         v-if="editable"
         class="page-header--input"
         type="text"
         :value="value"
         @input="updateValue"
         :placeholder="placeholder"
      />
      <div v-else class="page-header--content">
         <h1>
            <slot></slot>
            <slot name="text"></slot>
         </h1>
         <div class="page-header--actions">
            <slot name="actions"></slot>
         </div>
         <color-line v-if="colorLine" :type="colorLine" />
      </div>

   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import ColorLine from '@/components/ColorLine.vue'
   import {ColorLineType} from '@/components/types'

   export interface IPropsBreadcrumb {
      [name: string]: any
   }

   export interface IVisibleBreadcrumbs {
      name: string
      link?: object
   }

   @Component({
      components:{
         ColorLine
      }
   })
   export default class PageHeader extends Vue {
      @Prop({
         type: Boolean,
         default: true
      })
      highlight?: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      editable?: boolean

      @Prop({
         type: String,
         default: ''
      })
      value?: string

      @Prop({
         type: [String, Boolean]
      })
      colorLine?: ColorLineType

      @Prop({
         type: Boolean,
         default: false
      })
      textWidth?: boolean

      @Prop({
         type: String
      })
      placeholder?: string

      @Prop({
         type: Array
      })
      breadcrumbs?: Array<string | IPropsBreadcrumb>

      ColorLineType = ColorLineType

      get visibleBreadcrumbs(): Array<IVisibleBreadcrumbs> {
         if(!this.breadcrumbs)
            return []

         return this.breadcrumbs.map(b => {
            if(typeof b === 'string')
               return {
                  name: b
               }

            const name = Object.keys(b)[0]
            let link = b[name]
            if(typeof link === 'string')
               link = {path: link}
            return {
               name,
               link
            }
         })
      }

      @Emit('input')
      updateValue(event: any) {
         return event.target.value
      }
   }
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   .page-header {
      width: 100%;
      margin-bottom: 0;
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      min-height: 5rem;

      &--breadcrumbs {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-start;
         padding: 0;
         color: $secondary-text-color;
         font-size: 0.9rem;
         font-weight: 400;
         margin: 0 auto;
         max-width: $max-content-width;
         box-sizing: border-box;

         z-index: 1;
      }

      &--breadcrumb-separator {
         padding: 0 0.4rem;
         font-weight: bold;
      }

      &--breadcrumb-step.link {
         text-decoration: none;
         color: $secondary-text-color;
         font-size: 0.9rem;
         font-weight: 400;

         &:hover {
            text-decoration: underline;
         }
      }

      &--content {
         display: flex;
         flex-direction: row;
         width: 100%;
         margin: 0 auto;
         padding: 0 2rem;
         box-sizing: border-box;
         max-width: $max-content-width;
      }

      h1, &--input {
         margin: 0 auto 0 0;
         color: $header-text-color;
         font-size: 2.5rem;
         font-weight: bold;
         width: 100%;
      }

      &--actions {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-end;
         align-items: center;
      }

      &--input {
         border: none;
         width: 100%;
         outline: none;
         font-family: Roboto, sans-serif;
         max-width: $max-content-width;
         margin: 0 auto;
         padding: 0 2rem;
      }

      &.text-width {
         .page-header--content {
            padding: 0;
            max-width: $max-text-width;
         }

         .page-header--breadcrumbs {
            max-width: $max-text-width;
         }

         .page-header--input {
            padding: 0;
            max-width: $max-text-width;
         }
      }



      &.highlight {
         background: $active-gradient;
         margin-top: 0;

         h1 {
            color: $highlight-header-text-color;
         }

         .page-header--content {
            padding: 1rem $highlight-header-padding-sides;
         }

         &.breadcrumbs .page-header--content {
            padding-top: 0;
         }

         .page-header--breadcrumbs {
            padding: 0.3rem $highlight-header-padding-sides 0;
            color: $breadcrumbs-highlight-color;
            margin-bottom: -0.4rem;
         }

         .page-header--breadcrumb-step.link {
            color: $breadcrumbs-highlight-color;
         }
      }

      &.success {
         h1 {
            color: $success-color;
         }
      }

      &.error {
         h1 {
            color: $error-color
         }
      }

   }
</style>
