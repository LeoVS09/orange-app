<template>
    <div class="signin">
      <div class="signin--registration">
        <div class="signin--registration-link">
          <span class="signin--registration-text">Not a member yet? <span class="signin--registration-go">Sign Up</span> now!</span>
        </div>
      </div>
      <Input type="text" placeholder="Login or Email" :value.sync="login" :error.sync="isLoginError" :tabindex="1" :autofocus="true"/>
      <Input type="password" placeholder="Password" :value.sync="password" :error.sync="isPasswordError" :tabindex="2"/>
      <CheckBox :value.sync="isRemember">Remember me</CheckBox>
      <Button :tabindex="3" @click.native="clickSignIn">Sign in</Button>
      <div class="signin--forgot">
        <span class="signin--forgot-text">Forgot password?</span>
      </div>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import { Logo, Input, Button, CheckBox, Icon } from '../../components'
  import * as actions from '../../store/actionTypes';

  @Component({
    components: {
      Logo,
      Input,
      Button,
      CheckBox,
      Icon
    }
  })
  export default class SignIn extends Vue {

    isRemember = true;
    login = "";
    isLoginError = false;
    password = "";
    isPasswordError = false;

    clickSignIn() {
      if(!this.login.length){
        this.isLoginError = true;
      }
      if(!this.password.length) {
        this.isPasswordError = true;
      }

      if(this.isLoginError || this.isPasswordError){
        console.log("Have some input errors");
        // TODO: add icons for multiple types of errors input
        return
      }
      const login = this.login;
      const password = this.password;
      const isRemember = this.isRemember;

      this.$store.dispatch(actions.LOGIN_TO_PROFILE, {login, password, isRemember})
        .then(result => {
          if(result){
            this.$router.push({ name: 'home' });
          }
        })
        .catch(error => {
          // TODO: add checking for input errors from server
          console.error(error)
        })
    }

    clickRegister() {
      console.log("Register")
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

    &--registration {
      margin-top: 1rem;
      margin-bottom: 3rem;
      width: $inputWidth;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

      &-link {
        cursor: pointer;
        font-size: 0.8rem;
        color: $secondaryTextColor;

        &:hover {
          color: $inputColor;
        }
      }

      &-go {
        color: $inputColor;
      }

      &-icon {
        top: 0.35em;
        margin-left: -0.3em;
        margin-right: -0.3em;
      }
    }

    &--forgot {
      font-size: 0.8rem;
      display: flex;
      width: 100%;
      flex-direction: row;
      justify-content: center;
      color: $secondaryTextColor;
      cursor: pointer;

      &-text {
        margin-top: 1rem;
      }

      &:hover {
        color: $inputColor;
      }
    }
  }
</style>
