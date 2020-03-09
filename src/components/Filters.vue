<template>
   <div class="filters">
      <ButtonGroup
         :hoverAnimation="false"
         :meta="{
                  attributes: {
                     gradientHighlight: true
                  },
                  active,
                  buttons
               }"
         @click="onButtonClick"
      />
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import ButtonGroup from './ButtonGroup.vue'
import { ButtonGroupMetaItem } from './types'

@Component({
  components: {
    ButtonGroup
  }
})
export default class Filters extends Vue {
   @Prop({
     type: Array,
     required: true
   })
   public buttons!: ButtonGroupMetaItem[];

   @Prop({
     type: [Object, String, Number, Array]
   })
   public active: any;

   @Emit('click')
   public onButtonClick(value: any) {
     return value
   }
}
</script>

<style lang="scss">
   .filters {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-bottom: 1rem;
      margin-top: 1rem;
   }
</style>
