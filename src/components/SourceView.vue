<template>
   <div class="source-view">
      <code v-if="!editable" class="source-view--code">{{value}}</code>
      <TextareaAutoresize
         v-else
         class="source-view--input"
         :value="value"
         @input="updateValue"
         placeholder="// Add test"
      />
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import TextareaAutoresize from './TextareaAutoresize.vue'

@Component({
  components: {
    TextareaAutoresize
  }
})
export default class SourceView extends Vue {
   @Prop(String)
   public value!: String;

   @Prop(Boolean)
   public editable!: Boolean;

   public updateValue(value: string) {
     this.$emit('input', value)
   }
}
</script>

<style lang="scss" scoped>
   @import "../styles/config";

   .source-view {
      background-color: rgb(43, 58, 66);
      font-size: 13px;
      line-height: 19px;
      overflow: auto;
      padding: 8px 16px;
      border-radius: 3px;
      min-height: 19px;

      &--code {
         white-space: pre;
         color: #bfbfbf;
         font-family: 'IBM Plex Mono', monospace;
      }

      &--input {
         background-color: transparent;
         border: none;
         outline: none;
         color: white;
         width: 100%;
         resize: none;
         min-height: 3rem;
         overflow-x: hidden;
         box-sizing: border-box;

         &::placeholder {
            color: #b5b5b5;
         }
      }
   }
</style>
