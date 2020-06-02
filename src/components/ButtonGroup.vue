<template>
   <div :class="{
      'button-group': true,
      horizontal,
      vertical,
      secondary,
      bordered
   }">
      <div class="button-group--content">
         <slot :hovered="hovered"></slot>
         <template v-if="reflectedButtons">
            <Button
               v-for="item in reflectedButtons"
               :key="itemId(item)"
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
import { Component, Prop, Emit } from 'vue-property-decorator'
import hash from 'object-hash'
import {
  ButtonEvent,
  ButtonEvents,
  ButtonGroupMeta,
  ButtonGroupMetaItem
} from './types'
import Button from './Button.vue'

interface ReflectedButton {
   value: any;
   label: string;
   isActive: boolean;
}

@Component({
  components: {
    Button
  }
})
export default class ButtonGroup extends Vue {
  get reflectedButtons(): ReflectedButton[] | undefined {
    if (!this.meta || !this.meta.buttons)
      return

    const isActive = (active: any, value: any) => {
      if (!Array.isArray(active))
        return active === value

      return active.some(item => item === value)
    }

    return this.meta.buttons.map(b => {
      const keys = Object.keys(b)
      if (keys.length !== 1)
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

   @Prop({
     type: Object
   })
   public meta!: ButtonGroupMeta;

   @Prop({
     type: Boolean,
     default: true
   })
   public hoverAnimation!: boolean;

   @Prop({
     type: Boolean,
     default: true
   })
   public horizontal!: boolean;

   @Prop({
     type: Boolean,
     default: false
   })
   public vertical!: boolean;

   @Prop({
     type: Boolean,
     default: false
   })
   public secondary!: boolean;

   @Prop({
     type: Boolean,
     default: false
   })
   public bordered!: boolean;

   public hovered: string | null = null;

   public mounted() {
     this.$on(ButtonEvents.over, this.buttonOver)
     this.$on(ButtonEvents.leave, this.buttonLeave)
   }

   public buttonOver(event: ButtonEvent) {
     if (!this.hoverAnimation)
       return

     this.hovered = event.key
   }

   public buttonLeave(event: ButtonEvent) {
     if (this.hovered !== event.key)
       return

     this.hovered = null
   }

   public itemId(item: ButtonGroupMetaItem): string {
     if (item.id)
       return item.id

     return hash(item)
   }

   @Emit('click')
   public onButtonClick(value: any) {
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

      &.horizontal.bordered &--content {
         border-bottom: 1px solid $divider-line-color;
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
