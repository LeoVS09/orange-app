<template>
    <textarea
      class="textarea-autoresize"
      :value="value"
      @input="updateValue"
      :placeholder="placeholder"></textarea>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop} from 'vue-property-decorator'

  @Component
  export default class TextareaAutoresize extends Vue {

     @Prop({
        type: String
     }) value?: string

     @Prop({
        type: String
     }) placeholder?: string

    updateValue(event: any){
      this.$nextTick(this.resize);

      this.$emit('input', event);
    }

    mounted(){
      this.resize();
    }

    resize(){
      // @ts-ignore
      this.$el.style.setProperty('height', 'auto');
      let contentHeight = this.$el.scrollHeight + 1;

      const heightVal = contentHeight + 'px';
      // @ts-ignore
      this.$el.style.setProperty('height', heightVal);

      return this
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .textarea-autoresize{
    width: 100%;
    border: none;
    color: $main-text-color;
    height: auto;
    overflow: hidden;
    min-height: 3rem;
    resize: none;
    outline: none;
  }
</style>
