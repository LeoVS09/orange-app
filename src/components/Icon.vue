<template>
    <i class="material-icons">{{type}}</i>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'

  @Component({
    props: {
      type: String
    }
  })
  export default class Icon extends Vue {

  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .material-icons {
    position: relative;
    top: 0.2em;
  }

</style>
