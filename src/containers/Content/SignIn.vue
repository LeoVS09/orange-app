<template>
    <div class="signin">
      <div class="signin--registration">
        <div class="signin--registration-link" @click="clickRegister">
          <span class="signin--registration-text">Not a member yet? <span class="signin--registration-go">Sign Up</span> now!</span>
        </div>
      </div>
      <Input type="text" placeholder="Login or Email" :value.sync="login" :error.sync="isLoginError" :tabindex="1" :autofocus="true" :disabled="isLoginDisabled"/>
      <Input type="password" placeholder="Password" :value.sync="password" :error.sync="isPasswordError" :tabindex="2" :disabled="isPasswordDisabled"/>
      <CheckBox :value.sync="isRemember">Remember me</CheckBox>
      <Button :tabindex="3" @click.native="clickSignIn" class="signin--button" :disabled="isSubmitDisabled">Sign In</Button>
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

    isLoginDisabled = false;
    isPasswordDisabled = false;
    isSubmitDisabled = false;

    created(){
      this.$store.dispatch(actions.SET_SIGN_IN_PAGE);
    }

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

      this.isLoginDisabled = true;
      this.isPasswordDisabled = true;
      this.isSubmitDisabled = true;

      this.$store.dispatch(actions.LOGIN_TO_PROFILE, {login, password, isRemember})
        .then(result => {
          this.isLoginDisabled = false;
          this.isPasswordDisabled = false;
          this.isSubmitDisabled = false;
          if(result){
            this.$router.push({ name: 'home' });
          }
        })
        .catch(error => {
          this.isLoginDisabled = false;
          this.isPasswordDisabled = false;
          this.isSubmitDisabled = false;
          // TODO: add checking for input errors from server
          console.error(error)
        })
    }

    clickRegister() {
      this.$router.push({ name: 'signup' });
    }

  }
</script>

<style scoped lang="scss">
  @import "../../styles/config.scss";

  .signin {
    width: 100%;
    max-width: 95vw;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &--registration {
      margin-top: 1rem;
      margin-bottom: 3rem;
      width: 100%;
      max-width: $inputWidth;
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

    &--button {
      margin-top: 6rem;
    }
  }
</style>
