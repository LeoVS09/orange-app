<template lang="pug">
  .auth
    h1 Auth
</template>

<script>

  export default {
    name: 'authorisation',
    data () {
      return {
        isLogin: false
      }
    },
    methods: {
      login () {
        // Some login
      }
    }
  }

</script>

<style scoped lang="stylus">
  @import "../styles/config.styl"

  .auth
    width 100%
    height 100%
    display flex
    flex-direction row
    justify-content center

</style>
