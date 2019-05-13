<template>
   <div class="button-group">
      <div class="button-group--content">
         <slot :hovered="hovered"></slot>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import {ButtonEvent, ButtonEvents} from "./types";

   @Component
   export default class ButtonGroup extends Vue {

      mounted(){
         this.$on(ButtonEvents.over, this.buttonOver)
         this.$on(ButtonEvents.leave, this.buttonLeave)
      }

      hovered: string | null = null

      buttonOver(event: ButtonEvent){
         this.hovered = event.key
      }

      buttonLeave(event: ButtonEvent) {
         if(this.hovered !== event.key)
            return

         this.hovered = null
      }
   }
</script>

<style lang="scss">
   @import "../styles/config.scss";

   .button-group {

      &--content {
         width: 100%;
         display: flex;
         flex-direction: row;
      }
   }
</style>
