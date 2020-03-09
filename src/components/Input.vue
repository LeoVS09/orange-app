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
      <span class="input--error-message" v-if="typeof error === 'string'">{{error}}</span>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component, Prop, Watch, Mixins
} from 'vue-property-decorator'
import Focusable from './mixins/inputs/focusable'
import { toStringWhenDefined } from './utils'

interface Options {
   tabindex?: number;
   autofocus?: boolean;
   disabled?: boolean;
}

@Component
export default class Input extends Mixins(Focusable) {
   @Prop(String)
   public type!: string;

   @Prop(String)
   public placeholder!: string;

   @Prop(String)
   public value!: string;

   public currentValue = toStringWhenDefined(this.value);

   @Prop(Number)
   public tabindex!: number;

   @Prop(Boolean)
   public autofocus!: boolean;

   @Prop({
     type: [Boolean, String],
     default: false
   })
   public error!: boolean | string;

   @Prop(Boolean)
   public disabled!: boolean;

   public inputValue(event: any) {
     const { value } = event.target

     this.currentValue = value

     this.$emit('input', value)
   }

   @Watch('value')
   public updateValue(value: string) {
     this.currentValue = value
   }

   get options(): Options {
     const result = {} as Options

     if (this.tabindex)
       result.tabindex = this.tabindex

     if (this.autofocus)
       result.autofocus = true

     if (this.disabled)
       result.disabled = true

     return result
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
      position: relative;

      @include input-bottom-highlight();

      &--field {
         outline: none;
         margin-top: 0;
         padding: 0.5rem 0 0.2rem $input-left-padding;
         border: none;
         width: 100%;
         font-size: 1rem;
         min-height: $min-input-height;

         &:active, &:focus {
            outline: none;
         }
      }

      @include input-label-animation();

      &--error-message {
         width: 100%;
         margin: 0 auto 0.2rem;
         color: $error-color;
         font-size: 0.8rem;
         position: absolute;
         bottom: -1.2rem;
         text-align: center;
      }

   }
</style>
