<template>
  <div class="top-bar">
    <h1 class="logo">Orange</h1>
    <h3 class="profile">Profile</h3>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'top-bar'
  })
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
    .logo {
      margin-left: 1rem;
    }
    .profile {
      margin-right: 1rem;
    }
  }
</style>
