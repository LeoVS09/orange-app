<template>
  <div class="footer">
    <p>Written in SPB with <3</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component
  export default class Footer extends Vue {

  }
</script>

<style lang="scss" scoped>
  @import "../styles/config.scss";

  .footer {
    height: $footerHeight;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: "Roboto", sans-serif;
    position: fixed;
    bottom: 0;
    z-index: 5;
    background-color: $footerColor;
  }
</style>
