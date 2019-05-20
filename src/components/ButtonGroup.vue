<template>
   <div :class="{
      'button-group': true,
      horizontal,
      vertical,
      secondary
   }">
      <div class="button-group--content">
         <slot :hovered="hovered"></slot>
         <template v-if="reflectedButtons">
            <Button
               v-for="item in reflectedButtons"
               class="button-group--item"
               :hovered="hovered"
               :secondary="secondary"
               :active="item.isActive"
               @click="onButtonClick(item.value)"
               v-bind="meta.attributes"
            >{{item.label}}</Button>
         </template>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import {ButtonEvent, ButtonEvents} from "./types";
   import Button from './Button.vue'


   export interface ButtonGroupMetaItem {
      [key: string]: any
   }

   export interface ButtonGroupMeta {
      attributes?: Object,
      active?: any,
      buttons?: Array<ButtonGroupMetaItem>
   }

   interface ReflectedButton {
      value: any
      label: string
      isActive: boolean
   }

   @Component({
      components: {
         Button
      }
   })
   export default class ButtonGroup extends Vue {

      @Prop({
         type: Object
      })
      meta: ButtonGroupMeta

      @Prop({
         type: Boolean,
         default: true
      })
      hoverAnimation: boolean

      @Prop({
         type: Boolean,
         default: true
      })
      horizontal: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      vertical: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      secondary: boolean

      mounted() {
         this.$on(ButtonEvents.over, this.buttonOver)
         this.$on(ButtonEvents.leave, this.buttonLeave)
      }

      hovered: string | null = null

      buttonOver(event: ButtonEvent) {
         if (!this.hoverAnimation)
            return

         this.hovered = event.key
      }

      buttonLeave(event: ButtonEvent) {
         if (this.hovered !== event.key)
            return

         this.hovered = null
      }

      get reflectedButtons(): Array<ReflectedButton> | undefined {
         if(!this.meta || !this.meta.buttons)
            return

         const isActive = (active: any, value: any) => {
            if(!Array.isArray(active))
               return active === value

            return active.some(item => item === value)
         }

         return this.meta.buttons.map(b => {
            const keys = Object.keys(b)
            if(keys.length !== 1)
               throw new Error('Not implemented yet')

            const label = keys[0]
            const value = b[label]
            return {
               label,
               value,
               isActive: isActive(this.meta.active, value)
            }
         })
      }

      @Emit('click')
      onButtonClick(value: any) {
         return value
      }
   }
</script>

<style lang="scss">
   @import "../styles/config.scss";

   .button-group {

      &.horizontal &--content {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: center;
      }

      &--item {
         margin-right: 1rem;

         &::before, &::after {
            content: none;
         }

         &:last-child {
            margin-right: 0;
         }
      }

      &.secondary &--item {
         margin-right: 0;
         margin-left: 0;
         padding: 0;
      }


      &.vertical &--content {
         width: 100%;
         display: flex;
         flex-direction: column;
      }

   }
</style>
