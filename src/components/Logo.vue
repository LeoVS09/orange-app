<template>
  <h1 @click="clickHome" class="logo">Orange</h1>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component
  export default class Logo extends Vue {

  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .logo {
    font-size: 2rem;
    background: linear-gradient(160deg, #fda130, #fd7400, #ff6977);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
  }

</style>
