<template>
   <div class="checkbox-container" @click="click">
      <span class="checkbox-container--description"><slot></slot></span>
      <div class="checkbox-container--checkbox">
         <input type="checkbox" :checked="value"/>
         <label></label>
      </div>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class Checkbox extends Vue {
   @Prop({
     type: Boolean,
     required: true
   })
   public value!: boolean;

   @Emit('input')
   public click() {
     return !this.value
   }
}
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   .checkbox-container {
      margin-top: 1rem;
      width: 100%;
      max-width: $input-width;
      font-size: 0.8rem;
      $rememberColor: lighten($main-text-color, 30%);
      color: $rememberColor;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      cursor: pointer;

      &--description {
         text-decoration: none;
      }

      &--checkbox {
         width: 20px;
         position: relative;
         top: -0.2em;
         margin: 0 0 0 0.2rem;

         label {
            width: 20px;
            height: 20px;
            cursor: pointer;
            position: absolute;
            top: 0;
            left: 0;
            background: transparent;
            border-radius: 4px;
            font-size: 1rem;
            color: black;

            &:after {
               content: '';
               width: 9px;
               height: 5px;
               position: absolute;
               top: 4px;
               left: 4px;
               border: 3px solid $rememberColor;
               border-top: none;
               border-right: none;
               background: transparent;
               opacity: 0;
               transform: rotate(-45deg);
            }
         }

         input[type=checkbox] {
            visibility: hidden;

            &:checked ~ label:after {
               opacity: 1;
            }
         }
      }

      &:hover {
         .checkbox-container--description {
            color: $input-color;
         }

         .checkbox-container--checkbox label:after {
            opacity: 0.3;
            border-color: $input-color;
         }
      }
   }
</style>
