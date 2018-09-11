<template>
  <div class="line-spinner">
    <div class="line-spinner--line"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component()
  export default class LineSpinner extends Vue {

    //TODO: complete

  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .line-spinner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;

    &--line {
      width: 100%;
      height: 3px;
      background: linear-gradient(135deg, #fdc020, #fd8320, #ff6977)
    }
  }
</style>
