<template>
   <svg xmlns="http://www.w3.org/2000/svg"
        :width="width"
        :height="height"
        viewBox="0 0 48 48"
        fill="none"
        :aria-labelledby="iconName"
        role="presentation"
        @click="onClick"
   >
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>


<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'

   @Component
   export default class IconBase extends Vue {

      @Prop({
         type: String,
         default: 'box'
      }) iconName: string

      @Prop({
         type: [Number, String],
         default: 48
      }) width: number | string

      @Prop({
         type: [Number, String],
         default: 48
      }) height: number | string

      @Prop( {
         type: String,
         default: 'currentColor'
      }) iconColor: string

      onClick(event: any) {
         this.$emit('click', event.target.value)
      }
   }
</script>

<style lang="scss">

</style>
