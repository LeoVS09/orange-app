<template>
  <main>
    <top-bar></top-bar>
    <div class="home">
      <div v-bind:class='{ "content-wrapper": true, "text-page": isTextPage }'>
        <router-view></router-view>
      </div>
    </div>
    <footer-view></footer-view>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import TopBar from './TopBar.vue'
  import { Footer } from '@/components'
  import {Problem} from "../state"

  @Component({
    components: {
      TopBar,
      'footer-view': Footer
    }
  })
  export default class Home extends Vue {
    // @ts-ignore
    @Getter('isTextPage') isTextPage: boolean;
  }

</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .home {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    margin-top: $topBarHeight;
    padding-top: 0;
    padding-bottom: 3rem;
    z-index: 10;
    margin-bottom: $footerHeight;
    background-color: $backgroundColor;
    position: relative;
    box-shadow: 0 0 28px rgba(0,0,0,0.5);

    .content-wrapper {
      min-height: 100%;
      width: 100%;
      padding: $contentPaddingTop 0;
      margin: 0;
      flex: 1;
      &.text-page {
        margin: 0 auto;
        max-width: $maxTextWidth;
      }
    }
  }
</style>
