<template>
   <section class="data-view">
      <div
         class="data-view--item"
         v-for="(value, label) in values"
         @click="choseItem(value)"
      >
         <span class="data-view--label">{{label}}</span>
         <span class="data-view--value">{{valueToText(value)}}</span>
      </div>
   </section>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'

   export interface DataViewValues {
      [label: string]: any
   }

   @Component
   export default class DataView extends Vue {

      @Prop({
         type: Object,
         required: true
      }) values?: DataViewValues

      @Prop({
         type: Function,
         default: (value: any) => value
      }) valueToText: (value: any) => any

      choseItem(value: any) {
         this.$emit('click', value)
      }
   }
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   .data-view {
      width: 100%;
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      padding-bottom: 2rem;

      &--item {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         margin-bottom: 0.7rem;
      }

      &--label {
         color: $main-text-color;
         font-weight: bold;
      }

      &--value {
         color: $secondary-text-color;
         font-weight: lighter;
      }
   }


</style>
