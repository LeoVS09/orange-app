
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
  @import url('https://fonts.googleapis.com/css?family=Ubuntu:400,500');
  @import url('https://fonts.googleapis.com/css?family=Roboto:400');
  @import url('https://fonts.googleapis.com/css?family=Exo+2:600|Source+Sans+Pro:400');
  @import "./styles/default.scss";

  #app {
    width: 100%;
    height: 100%;
  }
</style>
