<template>
    <div :class="{'input-container': true, error}">
      <span :class="{'visible': !!value.length, 'input-container--text':true}">{{placeholder}}</span>
      <input :type="type" :placeholder="placeholder" :value="value" @input="updateValue" class="input-container--input" v-bind="options"/>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  interface Options {
    tabindex?: number,
    autofocus?: boolean,
    disabled?: boolean
  }

  @Component({
    props: {
      type: String,
      placeholder: String,
      value: String,
      tabindex: Number,
      autofocus: Boolean,
      error: Boolean,
      disabled: Boolean
    }
  })
  export default class Input extends Vue {
    error = false;

    updateValue(event: any){
      if(event.target.value.length) {
        this.error = false;
      }
      this.$emit('update:error', this.error);
      this.$emit('update:value', event.target.value)
    }

    get options(): Options {
      let result: Options = {};
      // @ts-ignore
      if(this.tabindex) {
        // @ts-ignore
        result['tabindex'] = this.tabindex;
      }
      // @ts-ignore
      if(this.autofocus){
        result['autofocus'] = true;
      }
      // @ts-ignore
      if(this.disabled){
        result['disabled'] = true;
      }
      return result;
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .input-container {
    width: 100%;
    max-width: $inputWidth;
    display: flex;
    flex-direction: column;
    justify-content: left;
    margin-top: 1rem;

    &--input {
      z-index: 3;
      outline: none;
      margin-top: 0;
      padding: 0.5rem 0.2rem;
      border: none;
      border-bottom: 1px solid $borderLineColor;
      width: 100%;

      &:active, &:focus {
        border-bottom-color: $inputColor;
      }
    }

    &--text {
      z-index: 2;
      font-size: 0.7rem;
      color: rgba(0, 0, 0, 0.65);
      opacity: 0;
      position: relative;
      bottom: -1rem;
      transition-property: all;
      transition-duration: 0.3s;

      &.visible {
        opacity: 1;
        bottom: 0;
      }
    }

    &.error {
      .input-container--input {
        border-bottom-color: $inputErrorColor;
      }
    }
  }
</style>
