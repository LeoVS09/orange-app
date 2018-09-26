<template>
    <textarea
      class="textarea-autoresize"
      :value="value"
      @input="updateValue"
      :placeholder="placeholder"></textarea>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component({
    props: {
      value: String,
      update: Function,
      placeholder: String
    }
  })
  export default class TextareaAutoresize extends Vue {
    updateValue(event: any){
      this.$nextTick(this.resize);
      // @ts-ignore
      this.update(event.target.value);
    }

    mounted(){
      this.resize();
    }

    resize(){
      this.$el.style.setProperty('height', 'auto');
      let contentHeight = this.$el.scrollHeight + 1;

      const heightVal = contentHeight + 'px';
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
    color: $mainTextColor;
    height: auto;
    overflow: hidden;
    min-height: 3rem;
    resize: none;
    outline: none;
  }
</style>
