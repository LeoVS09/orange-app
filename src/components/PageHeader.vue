<template>
   <div :class="{
      'page-header': true,
      highlight,
      success: colorLine === ColorLineType.success,
      error: colorLine === ColorLineType.error,
      'text-width': textWidth
   }">
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
            <slot>Page</slot>
         </h1>
         <color-line v-if="colorLine" :type="colorLine" />
      </div>

   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import ColorLine from '@/components/ColorLine.vue'
   import {ColorLineType} from '@/components/types'

   @Component({
      components:{
         ColorLine
      }
   })
   export default class PageHeader extends Vue {
      @Prop({
         type: Boolean,
         default: true
      }) highlight?: boolean

      @Prop({
         type: Boolean,
         default: false
      }) editable?: boolean

      @Prop({
         type: String,
         default: ''
      }) value?: string

      @Prop({
         type: [String, Boolean]
      }) colorLine?: ColorLineType

      @Prop({
         type: Boolean,
         default: false
      }) textWidth?: boolean

      @Prop({
         type: String
      }) placeholder?: string

      ColorLineType = ColorLineType

      updateValue(event: any) {
         this.$emit('input', event)
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
      flex-direction: row;

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
            padding: $highlight-header-padding;
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
