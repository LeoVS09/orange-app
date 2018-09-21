<template>
    <div class="button-container" @click="onClick">
      <button :class="{'button-container--submit': true, shadow, disabled}"><span v-if="!!icon"><Icon :type="icon" class="button-container--icon"/> </span><slot>Submit</slot></button>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import Spinner from './Spinner.vue'
  import Icon from './Icon.vue'

  interface Options {
    tabindex?: number,
    disabled?: boolean
  }

  @Component({
    props: {
      tabindex: Number,
      disabled: Boolean,
      icon: String,
      shadow: Boolean,
      click: Function
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

    onClick(){
      // @ts-ignore
      if(!this.disabled){
        // @ts-ignore
        this.click()
      }
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
      color: $buttonTextColor;
      cursor: pointer;
      transition-property: all;
      transition-duration: 0.1s;
      outline: none;
      font-weight: 700;
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
        background: linear-gradient(145deg, $buttonColor 0%, $buttonColor 40%, $buttonHighlightColor 50%, $buttonColor 60%, $buttonColor 100%);
        background-size: 200% 200%;
        animation: background-gradient 0.7s ease-in infinite;
      }
    }

    &--icon {
      font-size: 1rem;
    }
    
    @keyframes background-gradient {
      0%{background-position: 150% 50%}
      25%{background-position: 100% 50%}
      50%{background-position: 50% 50%}
      75%{background-position: 0% 50%}
      100%{background-position: -50% 50%}
    }
  }
</style>
