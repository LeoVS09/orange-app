<template>
   <section :class="{
      section: true,
      highlight,
      'text-width': textWidth,
      'without-margin': withoutMargin,
      'border-bottom': borderBottom,
      'border-top': borderTop,
   }">
      <slot></slot>
   </section>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'

   // TODO: Combine TextSection with this Section

   @Component
   export default class Section extends Vue {

      @Prop({
         type: Boolean,
         default: false
      }) highlight: boolean

      @Prop({
         type: Boolean,
         default: false
      }) textWidth: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      withoutMargin: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      borderBottom: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      borderTop: boolean
   }
</script>

<style lang="scss">
   @import "../styles/config";

   @mixin separate-line($bottom: true){
      position: relative;

      &:after, &:before {
         content: ' ';
         width: 100%;
         left: 0;
         right: 0;
         height: 1px;
         z-index: 1;
      }

      &:after {
         bottom: 0;
      }

      &:before {
         top: 0;
      }

      @if($bottom) {
         &:after {
            background: linear-gradient(to right, transparent 0%, $divider-line-color 15%, $divider-line-color 85%, transparent 100%);
         }
      }
      @else {
         &:before {
            background: linear-gradient(to right, transparent 0%, $divider-line-color 15%, $divider-line-color 85%, transparent 100%);
         }
      }
   }

   .section {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      margin: 5rem auto;
      padding: 0 $content-padding-sides;
      box-sizing: border-box;
      max-width: $max-content-width;
      font-size: 1rem;

      &.highlight {
         background-color: $highlight-section-color;
      }

      &.text-width {
         max-width: $max-text-width;
      }

      &.without-margin {
         margin-top: 0;
         margin-bottom: 0;
      }

      &.border-bottom {
         @include separate-line();
      }

      &.border-top {
         @include separate-line(false);
      }
   }
</style>
