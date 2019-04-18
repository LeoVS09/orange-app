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
      padding: $button-padding-top $button-padding-sides;
      border-radius: 3px;
      background-color: transparent;
      border: 1px solid $button-border-color;
      color: $button-text-color;
      cursor: pointer;
      transition-property: box-shadow;
      transition-duration: 0.1s;
      outline: none;
      font-weight: 500;

      &.active {
        background: $button-active-color;
        border: none;
        padding: calc(#{$button-padding-top} + 1px) calc(#{$button-padding-sides} + 1px);
        box-shadow: 0 0 20px 0 lighten($button-shadow-color, 30%);
        color: $button-active-text-color;
        font-weight: 700;
      }

      &.shadow {
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.8);
      }

      &:hover {
        color: $button-color;
      }

      &.active:hover {
        color: $button-active-text-color;
      }

      &.primary {
        padding: 0.5rem 5rem;
        border-radius: 1rem;
        background-color: $button-primary-color;
        border-color: $button-primary-color;
        box-shadow: 0 0 3px 0 lighten($button-primary-shadow-color, 10%);
        color: $button-primary-text-color;

        &:hover {
          background-color: lighten($button-primary-color, 3%);
          box-shadow: 0 0 10px 0 lighten($button-primary-shadow-color, 10%);
        }
      }

      &:active {
        border-color: $button-color;
      }

      &.disabled {
        background: linear-gradient(145deg, $button-color 0%, $button-color 40%, $button-highlight-color 50%, $button-color 60%, $button-color 100%);
        background-size: 200% 200%;
        animation: background-gradient 0.7s ease-in infinite;
      }

      &.primary.disabled {
        background: linear-gradient(145deg, $button-primary-color 0%, $button-primary-color 40%, $button-highlight-color 50%, $button-primary-color 60%, $button-primary-color 100%);
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
