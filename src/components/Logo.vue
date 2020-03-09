<template>
  <div @click="onClick" class="logo">
    <h1 class="logo--text">Orange</h1>
    <sup :class="{'logo--sup': true, auth: isAuth}">alpha</sup>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit, Prop } from 'vue-property-decorator'

@Component
export default class Logo extends Vue {
   @Prop({
     type: Boolean,
     default: false
   })
   public isAuth!: boolean;

   @Emit('click')
   public onClick(event: any) {
     return event
   }
}
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .logo {
    margin-top: 0;
    margin-bottom: 0;
    cursor: pointer;

    &--text {
      display: inline;
      font-size: 2rem;
      background: linear-gradient(160deg, #fda130, #fd7400, #ff6977);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Montserrat', sans-serif;
      margin-right: 0;
      margin-top: 0;
      margin-bottom: 0;
    }

    &--sup {
      position: relative;
      top: -0.5rem;
      left: -0.2rem;
      font-size: 0.8rem;
      color: $secondary-text-color;

      &.auth {
        top: 0.1rem;
        left: -0.7rem;
      }
    }
  }

</style>
