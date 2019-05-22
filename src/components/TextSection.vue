<template>
   <section :class="{
      'page-section': true,
      highlight,
      'text-width': textWidth
      }">
      <TextareaAutoresize
         class="page-section--editor"
         v-if="editable"
         :value="value"
         @input="updateValue"
         :placeholder="placeholder"></TextareaAutoresize>
      <p v-else class="page-section--content"><slot></slot></p>
   </section>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import TextareaAutoresize from './TextareaAutoresize.vue'

   // TODO: add markdown editor

   @Component({
      components: {
         TextareaAutoresize
      }
   })
   export default class TextSection extends Vue {

      @Prop({
         type: Boolean,
         default: false
      }) editable?: boolean

      @Prop({
         type: String
      }) value?: string

      @Prop({
         type: String
      }) placeholder?: string

      @Prop({
         type: Boolean,
         default: false
      }) highlight?: boolean

      @Prop({
         type: Boolean,
         default: true
      }) textWidth?: boolean

      @Emit('input')
      updateValue(value: string) {
         return value
      }
   }
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   .page-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      &--content, &--editor {
         padding-bottom: 1rem;
         padding-top: 2rem;
         margin-top: 5rem;
         margin-bottom: 5rem;
         font-size: 1.25rem;
         font-weight: 400;
         line-height: 1.7;
         width: 100%;
         max-width: $max-content-width;
      }

      &--editor {
         margin-bottom: 0;
      }

      &.text-width {
         .page-section--content, .page-section--editor {
            max-width: $max-text-width;
         }
      }

      &.highlight {
         background-color: $highlight-section-color;
         margin-top: 5rem;
         margin-bottom: 4.5rem;

         .page-section--content, .page-section--editor {
            padding-bottom: 0.5rem;
            padding-top: 1rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
         }
      }
   }


</style>
