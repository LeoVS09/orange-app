<template>
  <div class="home">
    <top-bar></top-bar>
    <h1>Home</h1>
    <div class='content-wrapper'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import TopBar from '@/components/TopBar.vue'

  export default Vue.extend({
    name: 'home',
    data () {
      return {
        data: {}
      }
    },
    methods: {
      someWork () {
        // it very important
      }
    },
    components: {
      TopBar
    }
  })

</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: $topBarHeight;
  }
</style>
