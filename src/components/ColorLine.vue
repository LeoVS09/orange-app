<template>
   <div :class="{
         'color-line': true,
         success: type === ColorLineType.success,
         error: type === ColorLineType.error
   }">
      <div class="color-line--content">
         <div class="color-line--left-triangle"></div>
         <div class="color-line--right-triangle"></div>
         <div class="color-line--left-triangle"></div>
         <div class="color-line--right-triangle"></div>
         <div class="color-line--left-triangle"></div>
         <div class="color-line--right-triangle last"></div>
      </div>

      <i class="material-icons color-line--icon">{{
         type === ColorLineType.success ? 'done' :
         type === ColorLineType.error ? 'error' : ''
         }}</i>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { ColorLineType } from '@/components/types'

   @Component
export default class ColorLine extends Vue {
      @Prop({
        type: String,
        default: ColorLineType.success,
      }) type?: ColorLineType

      ColorLineType = ColorLineType
}
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   $triangle-height: 1.4rem;
   $triangle-weight: 1.5rem;

   .color-line {
      flex: 1;
      display: flex;
      flex-direction: row;
      height: $triangle-height;
      margin-top: 1rem;
      padding-left: 1rem;
      box-sizing: border-box;

      &--content {
         display: flex;
         flex-direction: row;
         width: 100%;
      }

      &--icon {
         display: inline-block;
         top: 0;
         margin-top: -0.2em;
         font-size: 2.4rem;
      }

      &--left-triangle, &--right-triangle {
         font-size: 0;
         line-height: 0;
         width: 0;

      }

      &--left-triangle {
         background-color: $success-color;
         border-top: $triangle-height solid $background-color;
         border-right: $triangle-weight solid $success-color;
      }

      &--right-triangle {
         background-color: $success-color;
         border-bottom: $triangle-height solid $background-color;
         border-left: $triangle-weight solid $success-color;

         &.last {
            margin-left: auto;
         }
      }

      &.success {
         .color-line--content {
            background-color: $success-color;
         }
         .color-line--icon {
            color: $success-color;
         }
      }

      &.error {
         .color-line--content {
            background-color: $error-color;
         }
         .color-line--icon {
            color: $error-color;
         }
      }
   }
</style>
