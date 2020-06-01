<template>
   <div class="floating-button--container">
      <transition name="button-fade-up">
         <div class="floating-button" v-if="visible">
            <Button
               @click="onClick"
               class="floating-button--action"
               v-bind="$props"
            ><slot></slot></Button>
         </div>
      </transition>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component, Watch, Prop, Mixins
} from 'vue-property-decorator'
import ButtonBase from './mixins/inputs/baseButton'
import Button from './Button.vue'

@Component({
  components: {
    Button
  }
})
export default class FloatingButton extends Mixins(ButtonBase) {
   @Prop({
     type: Boolean,
     default: true
   })
   public visible!: boolean;

   public onClick(event: any) {
     this.$emit('click', event)
   }
}
</script>

<style lang="scss">
   @import "../styles/config";

   .floating-button {
      position: fixed;
      right: 3rem;
      bottom: 3rem;
      z-index: 6;
      width: 15rem;
      display: flex;
      flex-direction: row;

      &--action {
         margin-left: auto;
         margin-right: auto;
      }
   }

   .button-fade-up {
      &-enter-active, &-leave-active {
         transition: all 0.3s;
      }

      &-enter, &-leave-to {
         opacity: 0;
         bottom: -3rem;
      }
   }
</style>
