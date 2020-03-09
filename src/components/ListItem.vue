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
         <span
           class="list-item--property"
           v-for="(property, index) in properties"
           :key="typeof property !== 'undefined' ? `${property}` : index"
         >{{property | formatDate}}</span>
      </div>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import { randomId, formatDate, isDate } from './utils'
import { ListItemEvent, ListItemEvents, DataItem } from './types'

const defaultBackground = 'transparent'

function gradientCircleAtMouse(event: MouseEvent, background: string) {
  const x = event.clientX
  const y = event.clientY

  // @ts-ignore
  if (!event.currentTarget || !event.currentTarget.getBoundingClientRect)
    return background

  // @ts-ignore
  const box = event.currentTarget.getBoundingClientRect()

  const positionX = x - box.left
  const positionY = y - box.top
  return `radial-gradient(circle at ${positionX}px ${positionY}px, rgb(255, 75, 117) 0%, #FD7501 40%, #FD9624 100%)`
}

@Component
export default class ListItem extends Vue {
   public key = randomId();

   public background = defaultBackground;

   @Prop({
     type: Object,
     required: true
   })
   public item!: DataItem;

   @Prop({
     type: Array,
     default: []
   })
   public visibleProps!: string[];

   @Prop({
     type: Function
   })
   public formatData?: (a: DataItem) => DataItem;

   @Prop({
     type: Boolean,
     default: false
   })
   public gradientBackground!: boolean;

   @Prop({
     type: Boolean,
     default: true
   })
   public bordered!: boolean;

   @Prop({
     type: Boolean,
     default: true
   })
   public hoverShadow!: boolean;

   get properties() {
     let { item } = this
     if (this.formatData)
       item = this.formatData(item)

     let { visibleProps } = this
     if (!visibleProps)
       visibleProps = Object.keys(item)

     const result = visibleProps.map((key) => item[key])
     console.log('list item', result)
     return result
   }

   @Emit(ListItemEvents.move)
   public onMouseMove(event: MouseEvent) {
     if (this.gradientBackground)
       this.background = gradientCircleAtMouse(event, defaultBackground)
     else
       this.background = ''

     const itemEvent: ListItemEvent = { key: this.key }
     return itemEvent
   }

   @Emit(ListItemEvents.leave)
   public onMouseLeave() {
     this.background = defaultBackground

     const itemEvent: ListItemEvent = { key: this.key }
     return itemEvent
   }

   @Emit(ListItemEvents.over)
   public onMouseOver(event: MouseEvent) {
     if (this.gradientBackground)
       this.background = gradientCircleAtMouse(event, defaultBackground)
     else
       this.background = ''

     const itemEvent: ListItemEvent = { key: this.key }
     return itemEvent
   }

   @Emit(ListItemEvents.click)
   public onClick(event: any) {
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
