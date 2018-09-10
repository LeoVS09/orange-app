<template>
    <div class="button-container">
      <button class="button-container--submit"><slot>Submit</slot></button>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  interface Options {
    tabindex?: number
  }

  @Component({
    props: {
      tabindex: Number
    }
  })
  export default class Button extends Vue {
    get options(): Options {
      let result: Options = {};
      // @ts-ignore
      if(this.tabindex) {
        // @ts-ignore
        result['tabindex'] = this.tabindex;
      }
      return result;
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .button-container {
    &--submit {
      margin-top: 6rem;
      padding: 0.5rem 5rem;
      border-radius: 1rem;
      background-color: $buttonColor;
      border: none;
      box-shadow: 0 0 3px 0 lighten($buttonColor, 10%);
      color: white;
      cursor: pointer;
      transition-property: box-shadow;
      transition-duration: 0.1s;

      &:hover {

        background-color: lighten($buttonColor, 3%);
        box-shadow: 0 0 10px 0 lighten($buttonColor, 10%);
      }

      &:active {
        background-color: $activeColor;
      }
    }
  }
</style>
