<template>
      <Button
         :icon="icon"
         @click="onClick"
         :gradient-highlight="false"
         :circle="true"
         :contrast="true"
         :textOnHover="true"
      ><slot></slot></Button>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Emit} from 'vue-property-decorator';
import Button from '../components/Button.vue';

@Component({
   components: {
      Button,
   },
})
export default class PageHeaderAction extends Vue {

   @Prop({
      type: String,
      required: true,
   })
   public icon!: string;

   @Emit('click')
   public onClick(event: any) {
      return event;
   }
}
</script>
