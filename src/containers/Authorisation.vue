<template>
  <div class="auth">
    <h1>Auth</h1>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
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
  })

</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .auth {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
