<template>
  <div class="signup">
    <div class="signup--in">
      <div class="signup--in-link" @click="clickLogin">
        <span class="signup-in-text">Have profile? <span class="signup--in-go">Sign In</span> now!</span>
      </div>
    </div>
    <h2 class="signup--header">Create account</h2>

    <Input type="text" placeholder="First Name" :value.sync="firstName" :error.sync="isFirstNameError" :tabindex="1" :disabled="isDisabled"/>
    <Input type="text" placeholder="Last Name" :value.sync="lastName" :error.sync="isLastNameError" :tabindex="2" :disabled="isDisabled"/>

    <div class="signup--delimiter"></div>

    <Input type="text" placeholder="Email" :value.sync="email" :error.sync="isEmailError" :tabindex="3" :autofocus="true" :disabled="isDisabled"/>

    <div class="signup--delimiter"></div>

    <Input type="password" placeholder="Password" :value.sync="password" :error.sync="isPasswordError" :tabindex="4" :disabled="isDisabled"/>
    <Input type="password" placeholder="Confirm Password" :value.sync="confirmPassword" :error.sync="isConfirmPasswordError" :tabindex="5" :disabled="isDisabled"/>

    <p class="signup--agreement">We promise don't publish this information.</p>

    <Button :tabindex="6" @click.native="clickRegister" class="signup--button" :disabled="isDisabled">Sign Up</Button>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Watch} from 'vue-property-decorator'
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
  export default class SignUp extends Vue {

    email = "";
    isEmailError = false;

    password = "";
    isPasswordError = false;

    confirmPassword = "";
    isConfirmPasswordError = false;

    firstName = "";
    isFirstNameError = false;

    lastName = "";
    isLastNameError = false;

    isDisabled = false;

    created(){
      this.$store.dispatch(actions.SET_SIGN_UP_PAGE);
    }

    clickLogin() {
      this.$router.push({ name: 'signin' });
    }

    clickRegister() {
      this.isDisabled = true;
      this.$store.dispatch(actions.REGISTER_PROFILE, {
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password,
        email: this.email
      }).then(result => {
        this.isDisabled = false;
        if(result){
          this.$router.push({name: 'home'})
        }
      }).catch(error => {
        this.isDisabled = false;
        console.error(error)
      });
    }

    @Watch('confirmPassword')
    checkPassword(value: string, oldValue: string){

      if(!value.length){
        this.isConfirmPasswordError = false;
        return
      }

      if(value !== this.password){
        this.isConfirmPasswordError = true;
        return
      }

      this.isConfirmPasswordError = false;
    }

  }
</script>

<style scoped lang="scss">
  @import "../../styles/config.scss";

  .signup {
    width: 100%;
    height: 100%;
    max-width: 95vw;
    display: flex;
    flex-direction: column;
    align-items: center;

    &--header {
      font-size: 1.2rem;
      margin-bottom: 0;
    }

    &--delimiter {
      width: 100%;
      height: 1px;
      margin-top: 2.5rem;
      padding: 0;
    }

    &--in {
      margin-top: 1rem;
      margin-bottom: 1rem;
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
    }

    &--agreement {
      color: $secondaryTextColor;
      font-size: 0.9rem;
    }

    &--button {
      margin-top: 2rem;
    }
  }
</style>
