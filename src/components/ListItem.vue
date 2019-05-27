<template>
   <div
      :class="{
         'list-item': true,
         'gradient-background': gradientBackground,
         bordered,
         'hover-shadow': hoverShadow
      }"
      :style="{ background }"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      @mouseover="onMouseOver"
      @click="onClick"
   >
      <div class="list-item--content">
         <span class="list-item--property"
               v-for="property in properties"
         >{{property}}</span>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import {randomId, formatDate, isDate} from './utils'
   import {ListItemEvent, ListItemEvents, DataItem} from './types'

   const defaultBackground = 'transparent'

   function gradientCircleAtMouse(event: MouseEvent, defaultBackground: string) {
      let x = event.clientX;
      let y = event.clientY;

      // @ts-ignore
      if (!event.currentTarget || !event.currentTarget.getBoundingClientRect)
         return defaultBackground

      // @ts-ignore
      const box = event.currentTarget.getBoundingClientRect();

      let positionX = x - box.left;
      let positionY = y - box.top;
      return `radial-gradient(circle at ${positionX}px ${positionY}px, rgb(255, 75, 117) 0%, #FD7501 40%, #FD9624 100%)`
   }

   @Component
   export default class ListItem extends Vue {

      key = randomId()
      background = defaultBackground

      @Prop({
         type: Object,
         required: true
      })
      item: DataItem;

      @Prop({
         type: Array,
         default: []
      })
      visibleProps: Array<string>

      @Prop({
         type: Function
      })
      formatData?: (a: DataItem) => DataItem

      @Prop({
         type: Boolean,
         default: false
      })
      gradientBackground: boolean

      @Prop({
         type: Boolean,
         default: true
      })
      bordered: boolean

      @Prop({
         type: Boolean,
         default: true
      })
      hoverShadow: boolean

      get properties() {
         let item = this.item
         if (this.formatData)
            item = this.formatData(item)

         let visibleProps = this.visibleProps
         if (!visibleProps)
            visibleProps = Object.keys(item)

         return visibleProps.map(key => {
            const value = item[key]

            if (isDate(value))
               return formatDate(value)

            return value
         })
      }

      @Emit(ListItemEvents.move)
      onMouseMove(event: MouseEvent) {
         if (this.gradientBackground)
            this.background = gradientCircleAtMouse(event, defaultBackground)
         else
            this.background = ''

         const itemEvent: ListItemEvent = {key: this.key}
         return itemEvent
      }

      @Emit(ListItemEvents.leave)
      onMouseLeave() {
         this.background = defaultBackground

         const itemEvent: ListItemEvent = {key: this.key}
         return itemEvent
      }

      @Emit(ListItemEvents.over)
      onMouseOver(event: MouseEvent) {
         if (this.gradientBackground)
            this.background = gradientCircleAtMouse(event, defaultBackground)
         else
            this.background = ''

         const itemEvent: ListItemEvent = {key: this.key}
         return itemEvent
      }

      @Emit(ListItemEvents.click)
      onClick(event: any) {
         return event
      }
   }

</script>

<style lang="scss">
   @import "../styles/config";

   .list-item {
      width: 100%;
      padding-bottom: $problem-line-padding;
      padding-top: $problem-line-padding;
      transition: box-shadow 0.2s cubic-bezier(.25, .8, .25, 1);

      &.bordered {
         border-bottom: 1px solid $secondary-color;
      }

      &:hover {
         cursor: pointer;
         background: #F2F2F2;
      }

      &.gradient-background:hover {
         color: white;
      }

      &.hover-shadow:hover {
         box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
         background: transparent;
      }

      &--content {
         display: flex;
         flex-direction: row;

         span {
            flex: 1;
            text-align: center;

            &:first-child {
               flex: 3;
               padding-left: 1rem;
               text-underline: $main-text-color;
               text-align: left;
            }
         }


      }


   }

</style>
