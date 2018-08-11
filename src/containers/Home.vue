<template lang="pug">
  .home
    h1 Home
    .content-wrapper
      router-view
</template>

<script>

  export default {
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
    }
  }

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
