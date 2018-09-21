<template>
    <div class="button-container">
      <button v-if="!disabled" :class="{'button-container--submit': true, shadow}"><span v-if="!!icon"><Icon :type="icon" class="button-container--icon"/> </span><slot>Submit</slot></button>
      <div v-else><Spinner /></div>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import Spinner from './Spinner.vue'
  import Icon from './Icon.vue'

  // TODO: change type of disable into linear gradient

  interface Options {
    tabindex?: number,
    disabled?: boolean
  }

  @Component({
    props: {
      tabindex: Number,
      disabled: Boolean,
      icon: String,
      shadow: Boolean
    },
    components: {
      Spinner,
      Icon
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
      padding: 0.5rem 5rem;
      border-radius: 1rem;
      background-color: $buttonColor;
      border: none;
      box-shadow: 0 0 3px 0 lighten($buttonColor, 10%);
      color: white;
      cursor: pointer;
      transition-property: box-shadow;
      transition-duration: 0.1s;
      outline: none;

      &.shadow {
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.8);
      }

      &:hover {

        background-color: lighten($buttonColor, 3%);
        box-shadow: 0 0 10px 0 lighten($buttonColor, 10%);
      }

      &:active {
        background-color: $activeColor;
      }

      &.disabled {
        background-color: #969696;
      }
    }

    &--icon {
      font-size: 1rem;
    }
  }
</style>
