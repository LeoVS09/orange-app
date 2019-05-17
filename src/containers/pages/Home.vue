<template>
  <main>
    <top-bar
      :showProfileActions.sync="showProfileActions"
    ></top-bar>
    <div :class="{home: true, blured:showProfileActions}">
      <div class='content-wrapper'>
        <router-view></router-view>
      </div>
    </div>
    <footer-view :class="{blured: showProfileActions}"></footer-view>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import TopBar from './TopBar.vue'
  import { Footer } from '@/components'

  @Component({
    components: {
      TopBar,
      'footer-view': Footer
    }
  })
  export default class Home extends Vue {

    showProfileActions = false
  }

</script>

<style scoped lang="scss">
  @import "../../styles/config";

  .blured {
    filter: blur(10px);
  }

  .home {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin-top: $top-bar-height;
    padding-top: 0;
    padding-bottom: 3rem;
    z-index: 10;
    margin-bottom: $footer-height;
    background-color: $background-color;
    position: relative;
    box-shadow: 0 0 28px rgba(0,0,0,0.5);

    .content-wrapper {
      min-height: 100%;
      width: 100%;
      padding: 0 0;
      margin: 0;
      flex: 1;
    }
  }
</style>
