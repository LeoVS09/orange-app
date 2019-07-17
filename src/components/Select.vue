<template>
   <div
      :class="{'select': true, error}"
      @click="handleClick"
      v-click-outside="onBlur"
   >

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
         <div v-if="focused" :class="{
            'select--options-container': true,
            'empty': !visibleItems.length
         }">
            <div v-for="item in visibleItems" @mousedown="chooseItem(item)" class="select--option">
               <span class="select--option-text">{{item.text}}</span>
            </div>
            <div v-if="!visibleItems.length" class="select--options-loading skeleton-loading"></div>
         </div>
      </transition>
   </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch, Mixins, Emit} from 'vue-property-decorator';
import {toStringWhenDefined} from '@/components/utils';
import Focusable from './mixins/inputs/focusable';

interface SelectItem {
   text: string;
   value: any;
}

interface Options {
   tabindex?: number;
   autofocus?: boolean;
   disabled?: boolean;
}

@Component
export default class Select extends Mixins(Focusable) {

   @Prop({
      type: Array,
      default: [],
   })
   public items!: any[];

   @Prop(String)
   public placeholder!: string;

   @Prop([String, Number, Boolean])
   public value: any;

   public currentValue = toStringWhenDefined(this.value);

   @Prop({
      type: String,
      default: 'text',
   })
   public textField!: string;

   @Prop(Number)
   public tabindex!: number;

   @Prop(Boolean)
   public autofocus!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public error!: boolean;

   @Prop(Boolean)
   public disabled!: boolean;

   @Prop(Function)
   public extractText?: (value: any) => string;

   public extractTextFromItem = (value: any) => {
      if (this.extractText) {
         return this.extractText(value);
      }

      if (typeof value !== 'object') {
         return value as string;
      }

      return value[this.textField];
   }

   get visibleItems() {
      return this.items.map((value) => {
         const text = this.extractTextFromItem(value);

         return {text, value};
      });
   }

   @Emit('click')
   public handleClick() {
      this.focused = !this.focused;
      return this.focused;
   }

   @Emit('input')
   public chooseItem(item: SelectItem) {
      this.currentValue = item.text;
      return item.value;
   }

   @Watch('value')
   public updateValue(value: any) {
      if (typeof value !== 'object') {
         this.currentValue = value;
      }

      this.currentValue = value[this.textField];
   }

   get options(): Options {
      const result = {} as Options;

      if (this.tabindex) {
         result.tabindex = this.tabindex;
      }

      if (this.autofocus) {
         result.autofocus = true;
      }

      if (this.disabled) {
         result.disabled = true;
      }

      return result;
   }
}
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";
   @import "../styles/skeleton.scss";
   @import "../styles/mixins/inputBottomHighlight.scss";
   @import "../styles/mixins/inputLabelAnimation.scss";

   $input-padding-top: 0.5rem;
   $container-padding-top: 0;

   .select {
      position: relative;
      width: 100%;
      max-width: $input-width;
      display: flex;
      flex-direction: column;
      justify-content: left;
      margin-top: 1rem;
      padding-top: $container-padding-top;

      &--input-container {
         display: flex;
         flex-direction: row;
         cursor: pointer;

         @include input-bottom-highlight();
         @include input-label-animation(false);

         &.focused {
            box-shadow: $input-shadow;
            border-radius: 3px 3px 0 0;
         }
      }

      &--options-loading {
         width: 100%;
         max-width: $input-width;

         @include skeleton(10rem, $select-options-max-height, (
               (1rem, 1rem, 10rem, 1rem),
               (1rem, 3rem, 12rem, 1rem),
               (1rem, 5rem, 15rem, 1rem),
               (1rem, 7rem, 8rem, 1rem),
               (1rem, 9rem, 13rem, 1rem)
         ));
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
         box-shadow: $input-shadow;
         width: 100%;
         display: flex;
         flex-direction: column;
         border-radius: 0 0 3px 3px;

         max-height: $select-options-max-height;
         overflow-x: auto;
         -webkit-overflow-scrolling: touch;
         -ms-overflow-style: -ms-autohiding-scrollbar;
         scroll-behavior: smooth;

         &:after {

         }
      }

      &--option {
         padding: 0.5rem $input-left-padding;
         transition: $input-animation-time all;

         &:hover {
            padding-left: 1rem;
            color: $highlight-text-color;
         }

         &:active {
            background: darken($background-color, 10%);
         }
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
