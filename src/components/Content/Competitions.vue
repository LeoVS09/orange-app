<template>
  <div class="competitions">
    <h1>Competitions</h1>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
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
  })

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
