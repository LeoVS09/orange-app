<template>
   <div :class="{'input': true, error, 'have-value': !!currentValue.length, focused}">
      <input
         :type="type"
         :value="currentValue"
         @input="inputValue"
         @focus="onFocus"
         @blur="onBlur"
         class="input--field"
         v-bind="options"
      />
      <label class="input--label">{{placeholder}}</label>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Watch, Mixins} from 'vue-property-decorator'
   import Focusable from "./mixins/inputs/focusable";
   import {toStringWhenDefined} from "./utils";

   interface Options {
      tabindex?: number,
      autofocus?: boolean,
      disabled?: boolean
   }

   @Component
   export default class Input extends Mixins(Focusable) {

      @Prop(String)
      type: string;

      @Prop(String)
      placeholder: string;

      @Prop(String)
      value: string;

      currentValue = toStringWhenDefined(this.value);

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
   @import "../styles/mixins/inputBottomHighlight.scss";
   @import "../styles/mixins/inputLabelAnimation.scss";

   .input {
      width: 100%;
      max-width: $input-width;
      display: flex;
      flex-direction: column;
      justify-content: left;
      margin-top: 1rem;

      @include input-bottom-highlight();

      &--field {
         outline: none;
         margin-top: 0;
         padding: 0.5rem 0 0.2rem 0.3rem;
         border: none;
         width: 100%;
         font-size: 1rem;
         min-height: $min-input-height;

         &:active, &:focus {
            outline: none;
         }
      }

      @include input-label-animation();

   }
</style>
