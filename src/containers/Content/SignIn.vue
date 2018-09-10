<template>
    <div class="signin">
      <Input type="text" placeholder="Login or Email" :value.sync="login" :tabindex="1" :autofocus="true"/>
      <Input type="password" placeholder="Password" :value.sync="password" :tabindex="2"/>
      <CheckBox :value.sync="isRemember">Remember me</CheckBox>
      <Button :tabindex="3" @click.native="clickSignIn">Sign in</Button>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import { Logo, Input, Button, CheckBox } from '../../components'

  @Component({
    components: {
      Logo,
      Input,
      Button,
      CheckBox
    }
  })
  export default class SignIn extends Vue {

    isRemember = true;
    login = "";
    password = "";

    clickSignIn() {
      console.log("Sign in")
    }

  }
</script>

<style scoped lang="scss">
  @import "../../styles/config.scss";

  .signin {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
