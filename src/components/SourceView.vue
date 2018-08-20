<template>
  <div class="source-view">
    <code class="source-view--code">{{text}}</code>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component({
    props: {
      text: String
    }
  })
  export default class SourceView extends Vue {
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

    &--code {
      white-space: pre;
      color: #bfbfbf;
      font-family: 'Source Code Pro', monospace;
    }
  }
</style>
