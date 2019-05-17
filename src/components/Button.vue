<template>
   <div class="button"
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
            'another-hover': isAnotherButtonHovered,
            'gradient-highlight': gradientHighlight,
            'text-can-fade': textCanFade,
            'text-not-faded': !fadeText
         }">
         <div class="button--content">
            <span v-if="!!icon">
              <Icon :type="icon" class="button--icon"/>
            </span>
            <transition name="text-fade">
               <span v-if="!fadeText" class="button--text"><slot>Submit</slot></span>
            </transition>
         </div>
      </button>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import Spinner from './Spinner.vue'
   import Icon from './Icon.vue'
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

      get isAnotherButtonHovered(){
         if(this.hovered && this.hovered !== this.key)
            return true

         return false
      }

      onMouseOver(){
         const event: ButtonEvent = {key: this.key}
         this.$parent.$emit(ButtonEvents.over, event)
      }

      onMouseLeave(){
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
         transition-property: all;
         transition-duration: 0.1s;
         outline: none;
         font-weight: 500;
         color: $button-text-color;
         font-size: $button-font-size;

         &.gradient-highlight {
            .button--content {
               @include gradient-text-hover();

               &:hover {
                  .button--icon {
                     color: $gradient-start-color;
                  }
               }

            }
         }

         &.max-width {
            width: 100%;
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

            .button--content {
               background: none;
            }

            .button--content, .button--icon {
               color: inherit;
            }

         }

         &.simple {
            border: none;
            border-radius: 0;

            &.active {
               background: none;
               box-shadow: none;
               transition: all;
               transition-duration: 0.3s;

               .button--content {
                  @include gradient-text-hover();
                  background-position: 0 0;
               }

               .button--icon {
                  color: $gradient-start-color;
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

            &.gradient-highlight {
               .button--content {
                  @include gradient-text-hover($button-primary-text-color);
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
