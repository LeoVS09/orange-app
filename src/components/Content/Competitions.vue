<template lang="pug">
  .competitions
    h1 Competitions
</template>

<script>

  export default {
    name: 'competitions',
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
  @import "../../styles/config.styl"

  .competitions
    width 100%
    height 100%
    display flex
    flex-direction row
    justify-content center

</style>
