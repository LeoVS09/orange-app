<template>
  <div class="footer">
    <p>Made with <span class="heart"> </span> in Saint-Petersburg</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {

}
</script>

<style lang="scss" scoped>
  @import "../styles/config.scss";

  .footer {
    height: $footer-height;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: "Roboto", sans-serif;
    position: fixed;
    bottom: 0;
    z-index: 5;
    background-color: $footer-color;

  }
</style>

<style lang="scss">

  @keyframes heartbeat {
    0%,25%,50%,75%,100% {
      transform: scale3d(1,1,1);
    }

    40%,60% {
      transform: scale3d(1.2,1.2,1.2);
    }
  }

  .heart {
    animation: 2s heartbeat ease-in-out infinite;
    height: 0.8rem;
    width: 0.8rem;
    mask: url(../static/heart.svg) no-repeat center;
    background: #e75225;
    display: inline-block;
  }
</style>
