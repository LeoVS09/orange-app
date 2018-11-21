<template>
    <div class="button-container" @click="onClick">
      <button
        :class="{'button-container--submit': true, shadow, disabled, primary, active}">
        <span v-if="!!icon">
          <Icon :type="icon" class="button-container--icon"/>
        </span>
        <slot>Submit</slot>
      </button>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop} from 'vue-property-decorator'
  import Spinner from './Spinner.vue'
  import Icon from './Icon.vue'

  interface Options {
    tabindex?: number,
    disabled?: 'disabled'
  }

  @Component({
    components: {
      Spinner,
      Icon
    }
  })
  export default class Button extends Vue {

    // @ts-ignore
    @Prop(Number) tabindex: number;

    @Prop({
      type: Boolean,
      default: false
    })
    // @ts-ignore
    disabled: boolean;

    // @ts-ignore
    @Prop(String) icon: string;

    @Prop({
      type: Boolean,
      default: false
    })
    // @ts-ignore
    shadow: boolean;

    @Prop({
      type: Boolean,
      default: false
    })
    // @ts-ignore
    active: boolean;

    @Prop({
      type: Boolean,
      default: false
    })
    // @ts-ignore
    primary: boolean;

    @Prop({
      type: Function,
      default: () => {}
    })
    // @ts-ignore
    click: () => void;

    get options(): Options {
      let result = {} as Options;

      if(this.tabindex) {
        result['tabindex'] = this.tabindex;
      }

      if(this.disabled) {
        result['disabled'] = 'disabled';
      }

      return result;
    }

    onClick(){
      if(!this.disabled){
        this.click()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .button-container {
    &--submit {
      padding: $buttonPaddingTop $buttonPaddingSides;
      border-radius: 3px;
      background-color: transparent;
      border: 1px solid $buttonBorderColor;
      color: $buttonTextColor;
      cursor: pointer;
      transition-property: box-shadow;
      transition-duration: 0.1s;
      outline: none;
      font-weight: 500;

      &.active {
        background: $buttonActiveColor;
        border: none;
        padding: calc(#{$buttonPaddingTop} + 1px) calc(#{$buttonPaddingSides} + 1px);
        box-shadow: 0 0 20px 0 lighten($buttonShadowColor, 30%);
        color: $buttonActiveTextColor;
        font-weight: 700;
      }

      &.shadow {
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.8);
      }

      &:hover {
        color: $buttonColor;
      }

      &.active:hover {
        color: $buttonActiveTextColor;
      }

      &.primary {
        padding: 0.5rem 5rem;
        border-radius: 1rem;
        background-color: $buttonPrimaryColor;
        border-color: $buttonPrimaryColor;
        box-shadow: 0 0 3px 0 lighten($buttonPrimaryShadowColor, 10%);
        color: $buttonPrimaryTextColor;

        &:hover {
          background-color: lighten($buttonPrimaryColor, 3%);
          box-shadow: 0 0 10px 0 lighten($buttonPrimaryShadowColor, 10%);
        }
      }

      &:active {
        border-color: $buttonColor;
      }

      &.disabled {
        background: linear-gradient(145deg, $buttonColor 0%, $buttonColor 40%, $buttonHighlightColor 50%, $buttonColor 60%, $buttonColor 100%);
        background-size: 200% 200%;
        animation: background-gradient 0.7s ease-in infinite;
      }

      &.primary.disabled {
        background: linear-gradient(145deg, $buttonPrimaryColor 0%, $buttonPrimaryColor 40%, $buttonHighlightColor 50%, $buttonPrimaryColor 60%, $buttonPrimaryColor 100%);
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
