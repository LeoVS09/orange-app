
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import * as actions from './store/actionTypes';

  @Component
  export default class App extends Vue {
    created(){
      this.$store.dispatch(actions.INIT_PROFILE);
    }
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
