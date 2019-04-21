<template>
   <div :class="{'input': true, error, 'have-value': !!currentValue.length}">
      <input
         :type="type"
         :value="currentValue"
         @input="inputValue"
         class="input--field"
         v-bind="options"
      />
      <span class="input--bar"></span>
      <label class="input--label">{{placeholder}}</label>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Watch} from 'vue-property-decorator'

   interface Options {
      tabindex?: number,
      autofocus?: boolean,
      disabled?: boolean
   }

   @Component
   export default class Input extends Vue {
      currentValue = "";

      @Prop(String)
      type: string;

      @Prop(String)
      placeholder: string;

      @Prop(String)
      value: string;

      @Prop(Number)
      tabindex: number;

      @Prop(Boolean)
      autofocus: boolean;

      @Prop({
         type: Boolean,
         default: false
      })
      error: boolean;

      @Prop(Boolean)
      disabled: boolean;

      inputValue(event: any) {
         if (event.target.value.length) {
            this.error = false;
         }
         const value = event.target.value;

         this.currentValue = value;

         this.$emit('update:error', this.error);
         this.$emit('input', value)
      }

      @Watch('value')
      updateValue(value: string) {
         this.currentValue = value;
      }

      get options(): Options {
         let result = {} as Options;

         if (this.tabindex) {
            result['tabindex'] = this.tabindex;
         }

         if (this.autofocus) {
            result['autofocus'] = true;
         }

         if (this.disabled) {
            result['disabled'] = true;
         }

         return result;
      }
   }
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   $padding-left-width: 0.2rem;

   .input {
      width: 100%;
      max-width: $input-width;
      display: flex;
      flex-direction: column;
      justify-content: left;
      margin-top: 1rem;
      position: relative;

      &--field {
         outline: none;
         margin-top: 0;
         padding: 0.5rem 0 $padding-left-width 0.3rem;
         border: none;
         border-bottom: 1px solid $border-line-color;
         width: 100%;
         font-size: 1rem;

         &:active, &:focus {
            // border-bottom-color: $input-color;
            outline: none;
         }
      }

      &--label {
         color: $placeholder-color;
         font-size: 0.9rem;
         position: absolute;
         pointer-events: none;
         left: 0.3rem;
         top: 0.7rem;
         transition: 0.2s ease all;
      }

      &--field:focus ~ &--label, &.have-value &--field ~ &--label {
         top: -0.3rem;
         font-size: 0.6rem;
      }

      &--field:focus ~ &--label {
         color: $highlight-text-color;
      }

      &--bar {
         position: relative;
         display: block;
         width: calc(100% + #{$padding-left-width});

         &:before, &:after {
            content: '';
            height: 2px;
            width: 0;
            bottom: 1px;
            position: absolute;
            background: $input-color;
            transition: 0.2s ease all;
         }

         &:before {
            left: 50%;
         }

         &:after {
            right: 50%;
         }
      }

      &--field:focus ~ &--bar:before, &--field:focus ~ &--bar:after {
         width: 50%;
      }

      &.error {
         &--field:focus ~ &--label, &.have-value &--field ~ &--label {
            color: $input-error-color;
         }
         .input-container--input {
            border-bottom-color: $input-error-color;
         }
      }
   }
</style>
