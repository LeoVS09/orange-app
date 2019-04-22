<template>
   <div :class="{'select': true, error}" @click="handleClick" v-click-outside="onBlur">

      <div :class="{
         'select--input-container': true,
         focused,
         'have-value': !!currentValue.length
      }">
         <div class="select--text-container">
            <span class="select-text" >{{currentValue}}</span>
         </div>

         <label class="select--input-container--label">{{placeholder}}</label>

         <div class="select--arrow">
            <span>&#9662;</span>
         </div>
      </div>

      <transition name="fade-items">
         <div v-if="focused" class="select--options-container">
            <div v-for="item in visibleItems" @mousedown="chooseItem(item)" class="select--option">
               <span class="select--option-text">{{item.text}}</span>
            </div>
         </div>
      </transition>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Watch} from 'vue-property-decorator'
   import {toStringWhenDefined} from "@/components/utils";
   import Focusable from "./mixins/inputs/focusable";

   interface SelectItem {
      text: string
      value: any
   }

   interface Options {
      tabindex?: number,
      autofocus?: boolean,
      disabled?: boolean
   }

   @Component({
      mixins: [Focusable]
   })
   export default class Select extends Vue {

      @Prop({
         type: Array,
         default: []
      })
      items: Array<any>;

      @Prop(String)
      placeholder: string;

      @Prop([String, Number, Boolean])
      value: any;

      currentValue = toStringWhenDefined(this.value);

      @Prop({
         type: String,
         default: "text"
      })
      textField: string;

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

      @Prop(Function)
      extractText?: (value: any) => string

      extractTextFromItem = (value: any) => {
         if(this.extractText)
            return this.extractText(value)

         if (typeof value !== 'object')
            return value as string

         return value[this.textField]
      }

      get visibleItems() {
         return this.items.map(value => {
            const text = this.extractTextFromItem(value)

            return {text, value}
         })
      }

      handleClick() {
         // @ts-ignore
         this.focused = !this.focused
      }

      chooseItem(item: SelectItem) {
         this.currentValue = item.text;
         this.$emit('input', item.value)
      }

      @Watch('value')
      updateValue(value: any) {
         if (typeof value !== 'object') {
            this.currentValue = value;
         }

         this.currentValue = value[this.textField]
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

   $input-padding-top: 0.5rem;
   $container-padding-top: 0;

   .select {
      width: 100%;
      max-width: $input-width;
      display: flex;
      flex-direction: column;
      justify-content: left;
      margin-top: 1rem;
      position: relative;
      padding-top: $container-padding-top;

      &--input-container {
         display: flex;
         flex-direction: row;
         cursor: pointer;

         @include input-bottom-highlight();
         @include input-label-animation(false);
      }

      &--text-container {
         font-size: 1rem;
         padding: 0.5rem 0 0.2rem 0.3rem;
         width: 100%;
         min-height: $min-input-height;
      }

      &--arrow {
         margin-top: 0.5rem;
         transition: $input-animation-time all;
         color: $placeholder-color;
      }

      &--input-container.focused &--arrow {
         transform: rotate(180deg);
         color: $main-text-color;
      }

      &--options-container {
         position: absolute;
         cursor: pointer;
         top: $font-line-height-input-primary + ($input-padding-top * 2) + $container-padding-top;
         z-index: 3;
         background: $background-color;
         box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
         width: 100%;
         display: flex;
         flex-direction: column;
      }

      &--option {
         padding: 0.5rem;
         transition: $input-animation-time all;

         &:hover {
            padding-left: 1rem;
            color: $highlight-text-color;
         }

         &:active {
            background: darken($background-color, 10%);
         }
      }

      &--options-container:hover &--option:not(:hover) {
         opacity: 0.6;
      }


      &.error {
         .select--input {
            border-bottom-color: $input-error-color;
         }
      }

      .fade-items {
         &-active, &-active {
            transition: opacity .2s;
         }

         &-enter, &-leave-to {
            opacity: 0;
         }
      }
   }
</style>
