<template>
  <main>
    <div class="auth">
      <div class="auth--container">
        <p class="auth--description">Welcome to</p>
        <Logo @click.native="clickHome" class="auth--logo" />
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import { Logo, Input, Button } from '../components'

  @Component({
    components: {
      Logo,
      Input,
      Button
    }
  })
  export default class Authorisation extends Vue {

    isRemember = true;
    login = "";
    password = "";

    clickRemember() {
      this.isRemember = !this.isRemember;
    }

    clickHome(){
      this.$router.push({name: 'home'});
    }

  }

</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  main {
    background: linear-gradient(135deg, #fdc020, #fd8320, #ff6977);
  }

  .auth {
    width: 100%;
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 18vh;

    &--container {
      box-shadow: 0 1px 10px 0 rgba(0,0,0,0.4);
      width: 100%;
      max-width: $inputWidth + 6rem;
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 3rem;
      padding-bottom: 5rem;
      background-color: white;
    }

    &--description {
      margin-bottom: 0;
      position: relative;
      left: -2.1rem;
      color: $secondaryTextColor
    }

    &--logo {
      margin-top: 0;
      font-size: 2.5rem;
      margin-bottom: 0;
    }

  }
</style>
