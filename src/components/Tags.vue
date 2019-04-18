<template>
   <div class="tags">
      <span
         v-if="!values.length"
         class="tags--placeholder"><slot></slot></span>
      <span
         v-else
         v-for="tag in values"
         class="tags--item"
         @click="chooseTag(tag)"
      >{{tag.name}}</span>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'

   export interface BaseTag {
      name: string
   }

   @Component
   export default class Tags extends Vue {
      @Prop({
         type: Array,
         default: []
      }) values?: Array<BaseTag>

      chooseTag(tag: BaseTag) {
         this.$emit('click', tag)
      }
   }
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   .tags {
      margin-top: 0;
      margin-bottom: 0;
      color: $secondary-text-color;
      font-size: 0.8rem;
      display: flex;
      flex-direction: row;
      width: 100%;
      max-width: $max-text-width;
      justify-content: flex-end;

      &--item {
         margin-right: 0.5em;
         padding: 0.4rem 0.5rem;
         transition: 0.1s;

         &:hover {
            cursor: pointer;
            color: $highlight-text-color;
         }
      }
      
      &--placeholder {
         font-style: italic;
      }
   }
</style>
