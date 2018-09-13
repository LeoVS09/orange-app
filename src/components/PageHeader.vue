<template>
    <div class="page-header">
      <h1><slot>Some page</slot></h1>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component
  export default class PageHeader extends Vue {
  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .page-header {
    width: 100%;
    margin-bottom: 2rem;
    background: $activeGradient;
    display: flex;
    flex-direction: row;
    h1 {
      width: 100%;
      max-width: $maxContentWidth;
      margin: auto;
      color: white;
      padding: $headerPadding;

    }
  }
</style>
