<template>
  <div class="home">
    <h1>Home</h1>
    <div class='content-wrapper'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  let a: number;

  export default Vue.extend({
    name: 'home',
    data () {
      return {
        data: {a}
      }
    },
    methods: {
      someWork () {
        // it very important
      }
    }
  })

</script>

<style scoped lang="stylus">
  @import "../styles/config.styl"

  .home
    width 100%
    height 100%
    display flex
    flex-direction column
    justify-content center
    align-items center
</style>
