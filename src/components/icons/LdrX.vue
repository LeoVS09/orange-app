<template>
   <icon-base
      @click="onClick"
      iconName="ldr-x"
      :width="width"
      :heght="height"
      :iconColor="iconColor"
   >
      <path d="M46 36.4836L36.5714 45.8883L2 11.4046L11.4286 2L46 36.4836Z" fill="black"/>
      <path d="M38.5 2.88825C36.7438 2.88825 35.8947 3.20514 34.7799 4.38825L35.3634 3.80621L3.93487 35.155L5.2048 33.8883C4.13685 34.9858 3.88858 35.8347 3.88857 37.485C3.88857 40.8517 6.62475 43.5809 10 43.5809C11.754 43.5809 12.8855 43.0687 14 41.8883L43 13.3883C44.1861 12.2763 44.6114 10.7359 44.6114 8.98415C44.6114 5.61748 41.8752 2.88825 38.5 2.88825Z" fill="black"/>
   </icon-base>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import IconBase from './IconBase.vue'

@Component({
  components: {
    IconBase,
  },
})
export default class LdrX extends Vue {
   @Prop({
     type: [Number, String],
     default: 18,
   }) public width!: number | string;

   @Prop({
     type: [Number, String],
     default: 18,
   }) public height!: number | string;

   @Prop({
     type: String,
     default: 'currentColor',
   }) public iconColor!: string;

   public onClick(value: any) {
     this.$emit('click', value)
   }
}
</script>

<style lang="scss">

</style>
