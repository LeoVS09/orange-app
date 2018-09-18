<template>
  <div class="source-view">
    <code v-if="!editable" class="source-view--code">{{text}}</code>
    <input v-else class="source-view--input" type="text" :value="text" @input="updateValue" placeholder="// Add test"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component({
    props: {
      text: String,
      editable: Boolean,
      update: {
        type: Function,
        required: true
      }
    }
  })
  export default class SourceView extends Vue {

    updateValue(event: any){
      // @ts-ignore
      if(this.update) {
        // @ts-ignore
        this.update(event.target.value);
      }
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

    &--code {
      white-space: pre;
      color: #bfbfbf;
      font-family: 'Source Code Pro', monospace;
    }

    &--input {
      background-color: transparent;
      border: none;
      outline: none;
      color: white;
      width: 100%;

      &::placeholder {
        color: #b5b5b5;
      }
    }
  }
</style>
