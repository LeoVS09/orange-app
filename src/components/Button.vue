<template>
   <div :class="{
      'button': true,
      'max-width': maxWidth,
      'max-height': maxHeight,
   }"
        @click="onClick"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
   >
      <button
         :class="{
            'button--submit': true,
            shadow,
            simple,
            disabled,
            primary,
            active,
            circle,
            'max-width': maxWidth,
            'max-height': maxHeight,
            'another-hover': isAnotherButtonHovered,
            'border-highlight': borderHighlight,
            'gradient-highlight': borderHighlight ? false : gradientHighlight,
            'text-can-fade': textCanFade,
            'text-not-faded': !fadeText,
            secondary,
            ghost,
            bold,
            'bigger-font': biggerFont,
            'no-active-bold': noActiveBold,
            'simple-active': simpleActive,
            contrast,
            'text-on-hover': textOnHover,
            'static-size': staticSize,
            'icon-left': !!icon && iconLeft,
            'icon-right': !!icon && !iconLeft,
            'only-icon': onlyIcon,
            'left-align': leftAlign,

         }">
         <div class="button--content">
            <span v-if="!!icon && iconLeft">
              <Icon :type="icon" class="button--icon button--icon-left"/>
            </span>
            <transition name="text-fade">
               <span v-if="!fadeText" class="button--text"><slot></slot></span>
            </transition>
            <span v-if="!!icon && !iconLeft">
              <Icon :type="icon" class="button--icon button--icon-right"/>
            </span>
         </div>
      </button>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import Spinner from './Spinner.vue'
   import Icon from './icons/MaterialIcon.vue'
   import {randomId} from './utils'
   import {ButtonEvent, ButtonEvents} from './types'
   import ButtonBase from './mixins/inputs/baseButton'

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
   export default class Button extends Mixins(ButtonBase) {

      key = randomId()

      get isAnotherButtonHovered() {
         if (this.hovered && this.hovered !== this.key)
            return true

         return false
      }

      onMouseOver() {
         const event: ButtonEvent = {key: this.key}
         this.$parent.$emit(ButtonEvents.over, event)
      }

      onMouseLeave() {
         const event: ButtonEvent = {key: this.key}
         this.$parent.$emit(ButtonEvents.leave, event)
      }

      get options(): Options {
         let result = {} as Options;

         if (this.tabindex) {
            result['tabindex'] = this.tabindex;
         }

         if (this.disabled) {
            result['disabled'] = 'disabled';
         }

         return result;
      }

      onClick() {
         if (this.disabled)
            return

         this.$emit('click')
      }
   }
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";
   @import "../styles/mixins/gradientTextHover.scss";

   .button {

      &.max-width {
         width: 100%;
      }

      &.max-height {
         height: 100%;
      }

      &--icon {
         font-size: 1rem;
         color: $button-text-color;
      }

      &--submit {
         padding: $button-padding-top $button-padding-sides;
         border-radius: 3px;
         background-color: transparent;
         border: 1px solid $button-border-color;
         cursor: pointer;
         transition-property: opacity;
         transition-duration: 0.1s;
         outline: none;
         font-weight: 500;
         color: $button-text-color;
         font-size: $button-font-size;
         position: relative;
         overflow: hidden;
         user-select: none;

         &.bigger-font {
            font-size: $button-bigger-size;
         }

         &.bold {
            font-weight: bold;
         }

         &.left-align {
            .button--content {
               text-align: left;
            }
         }

         &.gradient-highlight {
            @include gradient-text-hover-background('button--content');

            &:hover {
               .button--content {
                  .button--icon {
                     color: $button-active-text-color;
                  }
               }
            }
         }

         &.max-width {
            width: 100%;
         }

         &.max-height {
            height: 100%;
         }

         &.another-hover {
            opacity: 0.7;
         }

         &.active {
            background: $button-active-color;
            border: none;
            padding: calc(#{$button-padding-top} + 1px) calc(#{$button-padding-sides} + 1px);
            box-shadow: 0 0 20px 0 lighten($button-shadow-color, 30%);
            color: $button-active-text-color;
            font-weight: 700;

            &.no-active-bold {
               font-weight: 400;
            }

            .button--content {
               background: none;
            }

            .button--content, .button--icon {
               color: inherit;
            }

            &::before {
               content: none;
            }

            &:hover {
               .button--content {
                  animation: none;
               }
            }

         }

         &.simple {
            border: none;
            border-radius: 0;
            padding: $button-padding-top $button-padding-sides;

            &::before {
               content: none;
            }

            .button--content {
               transition: all $default-animation-time;
            }

            &:hover {
               &::before {
                  transform: none;
               }

               .button--content {
                  color: $gradient-start-color;
               }
            }

            &.gradient-highlight {
               @include gradient-text-inside-hover('button--content');

               .button--icon-right {
                  transition: color;
                  transition-delay: $default-animation-time;
               }

               &:hover {
                  .button--icon {
                     color: $gradient-start-color;
                  }

                  .button--content {
                     animation: none;
                  }
               }
            }

            &.active {
               background: none;
               box-shadow: none;
               transition: all;
               transition-duration: 0.3s;

               @include gradient-text-inside-hover('button--content');

               .button--content {
                  background-position: -1% 0;
               }

               &.simple-active .button--content {
                  color: $gradient-start-color;
               }

               .button--icon {
                  color: $gradient-start-color;
               }

               &.border-highlight {

                  .button--content, .button--icon {
                     color: $highlight-text-color;
                     background: none;
                  }
               }
            }
         }

         &.border-highlight {
            border-bottom: 3px solid transparent;

            .button--content, .button--icon {
               color: $secondary-text-color;
               background: none;
            }

            &:hover {
               border-bottom: 1px solid $highlight-text-color;
            }
         }

         &.active.border-highlight {

            &, &.simple, &:hover, &.simple:hover {
               border-bottom: 2px solid $secondary-text-color;

               .button--content, .button--icon {
                  color: $secondary-text-color;
                  background: none;
               }
            }
         }

         &.only-icon {
            padding: 0.1rem;

            .button--icon {
               font-size: 1.5rem;
            }
         }

         &.secondary {
            color: $secondary-text-color;
            font-size: 1rem;
            padding: 0.5rem 1rem;

            &.active {
               font-weight: bold;

               &.no-active-bold {
                  font-weight: 400;
               }
            }
         }

         &.ghost {
            color: $placeholder-color;
            font-size: 1rem;
            padding: 0 0.5rem;

            .button--content, .button--icon {
               transition: color $default-animation-time;
               color: $placeholder-color;
            }

            &:hover {

               .button--content, .button--icon {
                  color: $secondary-text-color;
               }
            }
         }

         &.contrast {
            border-color: $background-color;
            transition: all $default-animation-time;

            .button--content, .button--icon {
               color: $background-color;
               transition: all $default-animation-time;
            }

            &:hover {
               background-color: $background-color;

               .button--content, .button--icon {
                  color: $primary-text-color;
               }
            }
         }

         &.text-can-fade {
            background: $background-color;
            padding-left: 0;
            padding-right: 0;

            .button--content {
               position: relative;
            }

            .button--text {
               color: $button-text-color;
            }
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
            transition: all 0.2s ease-in-out;

            &.gradient-highlight {
               @include gradient-text-inside-hover('button--content', $button-primary-text-color);

               &::before {
                  content: none;
               }

               &:hover {

                  .button--content {
                     animation: none;

                  }
               }
            }

            .button--icon {
               color: $button-primary-text-color;
            }

            &:hover {
               background-color: lighten($button-primary-color, 3%);
               box-shadow: 0 0 10px 0 lighten($button-primary-shadow-color, 10%);
            }
         }

         &.shadow {
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.8);

            &.primary {
               box-shadow: 0 0 7px 0 lighten($button-primary-shadow-color, 10%);
            }
         }

         &.circle {
            padding: 0.5rem 1rem;
            border-radius: 2rem;

            .button--content {
               margin-top: -0.1rem;

               &:hover {
                  background-position: 0 1rem;
               }
            }
         }

         &.text-on-hover {
            padding: 0.5rem 0.6rem;
            position: relative;
            transition: all $default-animation-time;

            .button--text {
               position: absolute;
               white-space: nowrap;
               opacity: 0;
               top: 0.6rem;
               transition: all $default-animation-time;
            }

            &.simple .button--text {
               top: 0.7rem;
            }

            &:hover {
               .button--text {
                  opacity: 1;
               }
            }

            &.static-size {
               .button--icon {
                  transition: all $default-animation-time;
               }

               &:hover {
                  .button--text {
                     opacity: 1;
                  }
               }
            }

            &.icon-left {
               .button--text {
                  left: 1rem;
               }

               &:hover {
                  padding-right: 6rem;

                  .button--text {
                     left: 2rem;
                  }
               }

               &.static-size {
                  padding-right: 6rem;

                  &:hover {
                     padding-right: 6.5rem;

                     .button--icon {
                        margin-left: -0.5rem;
                     }

                     .button--text {
                        left: 1.5rem;
                     }
                  }
               }
            }

            &.icon-right {
               .button--text {
                  right: 1rem;
               }

               &:hover {
                  padding-left: 6rem;

                  .button--text {
                     right: 2rem;
                  }
               }

               &.static-size {
                  padding-left: 6rem;

                  &:hover {
                     padding-left: 6.5rem;

                     .button--icon {
                        margin-right: -0.5rem;
                     }

                     .button--text {
                        right: 1.5rem;
                     }
                  }
               }
            }
         }

         .doubleArrowLeft {
            background: #474E51;
            color: #fff;
            display: inline-block;
            height: 40px;
            width: 120px;
            line-height: 40px;
            text-align: center;
            transition: all 0.4s;
         }

         .doubleArrowLeft span {
            display: inline-block;
            position: relative;
            transition: 0.4s;
         }

         .doubleArrowLeft span:after {
            content: '\00ab';
            position: absolute;
            opacity: 0;
            top: 0;
            left: -10px;
            transition: 0.4s;
         }

         .doubleArrowLeft:hover span {
            padding-left: 15px;
         }

         .doubleArrowLeft:hover span:after {
            opacity: 1;
            left: 0;
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

      @keyframes background-gradient {
         0% {
            background-position: 150% 50%
         }
         25% {
            background-position: 100% 50%
         }
         50% {
            background-position: 50% 50%
         }
         75% {
            background-position: 0% 50%
         }
         100% {
            background-position: -50% 50%
         }
      }


      .text-fade {
         &-enter-active, &-leave-active {
            transition: transform .2s ease-in-out;
            transform: translateX(-100%);
         }

         &-enter, &-leave-to {
            transform: translateX(0);
         }
      }
   }
</style>
