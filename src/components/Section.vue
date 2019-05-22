<template>
   <section class="section">
      <slot></slot>
   </section>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'

   // TODO: Combine TextSection with this Section

   @Component
   export default class Section extends Vue {

   }
</script>

<style lang="scss">
   @import "../styles/config";

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
   }
</style>
