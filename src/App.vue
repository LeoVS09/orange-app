
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700');
  @import url('https://fonts.googleapis.com/css?family=Montserrat:700');
  @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');
  @import url('https://fonts.googleapis.com/css?family=Montserrat:700');
  @import "./styles/default.scss";

  #app {
    width: 100%;
    height: 100%;
  }
</style>
