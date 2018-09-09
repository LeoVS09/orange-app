<template>
  <div class="top-bar">
    <Logo @click.native="clickHome" class="top-bar--logo" />
    <Icon @click.native="clickProfile" class="profile" type="account_circle" />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Logo, Icon} from '../components'

  @Component({
    components: {
      Icon,
      Logo
    }
  })
  export default class TopBar extends Vue {
    clickHome(){
      this.$router.push({name: 'home'});
    }

    clickProfile() {
      this.$router.push({name: 'authorisation'});
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

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

    &--logo {
      margin-left: 1rem;
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
    }

    .profile {
      margin-right: 1rem;
      margin-top: 0.3rem;
      cursor: pointer;
      font-size: 1.7rem;
    }
  }
</style>
