<template>
  <div class="top-bar">
    <h1 v-on:click="clickHome" class="logo">Orange</h1>
    <h3 class="profile">Profile</h3>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component
  export default class TopBar extends Vue {
    clickHome(){
      this.$router.push({name: 'home'});
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .top-bar {
    position: fixed;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    top: 0;
    width: 100%;
    height: $topBarHeight;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: $backgroundColor;
    z-index: 20;

    .logo {
      margin-left: 1rem;
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
      font-size: 3rem;
      background: linear-gradient(160deg, #fda130, #fd7400, #ff6977);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Montserrat', sans-serif;
      cursor: pointer;
    }

    .profile {
      margin-right: 1rem;
      cursor: pointer;
    }
  }
</style>
