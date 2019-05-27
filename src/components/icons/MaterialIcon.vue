<template>
   <i class="material-icons"><slot>{{type}}</slot></i>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'

   @Component({
      props: {
         type: String
      }
   })
   export default class MaterialIcon extends Vue {

   }
</script>

<style scoped lang="scss">
   @import "../../styles/config";

   .material-icons {
      position: relative;
      top: 0.2em;
      user-select: none;
   }

</style>
