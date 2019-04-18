<template>
   <div class="signin">
      <div class="signin--registration">
         <div class="signin--registration-link" @click="clickRegister">
            <span class="signin--registration-text">Not a member yet? <span
               class="signin--registration-go">Sign Up</span> now!</span>
         </div>
      </div>
      <div class="signin--error" v-if="error"><span>{{error}}</span></div>
      <Input type="text" placeholder="Login or Email" v-model="login" @keyup.enter.native="clickSignIn"
             :error.sync="isLoginError" :tabindex="1" :autofocus="true" :disabled="isLoginDisabled"/>
      <Input type="password" placeholder="Password" v-model="password" @keyup.enter.native="clickSignIn"
             :error.sync="isPasswordError" :tabindex="2" :disabled="isPasswordDisabled"/>
      <CheckBox v-model="isRemember">Remember me</CheckBox>
      <Button
         :tabindex="3"
         :click="clickSignIn"
         class="signin--button"
         :disabled="isSubmitDisabled"
         :primary="true"
      >Sign In
      </Button>
      <div class="signin--forgot">
         <span class="signin--forgot-text">Forgot password?</span>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Logo, Input, Button, CheckBox, Icon} from '../../components'
   import * as actions from '../../store/actionTypes';

   @Component({
      // TODO: fix this
      // @ts-ignore
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
      error = null

      isLoginDisabled = false;
      isPasswordDisabled = false;
      isSubmitDisabled = false;

      created() {
         this.$store.dispatch(actions.SET_SIGN_IN_PAGE);
      }

      clickSignIn() {
         if (!this.login.length)
            this.isLoginError = true;
         else
            this.isLoginError = false;

         if (!this.password.length)
            this.isPasswordError = true;
         else
            this.isPasswordError = false;

         if (this.isLoginError || this.isPasswordError) {
            console.log("Have some input errors");
            // TODO: add icons for multiple types of errors input
            return
         }

         if(this.error)
            this.error = null

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
               if (result) {
                  this.$router.push({name: 'home'});
               }
            })
            .catch(error => {
               this.isLoginDisabled = false;
               this.isPasswordDisabled = false;
               this.isSubmitDisabled = false;
               // TODO: add checking for input errors from server
               console.error(error)
               this.isLoginError = true
               this.isPasswordError = true
               this.error = error
            })
      }

      clickRegister() {
         this.$router.push({name: 'signup'});
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
         max-width: $input-width;
         display: flex;
         flex-direction: row;
         justify-content: flex-end;

         &-link {
            cursor: pointer;
            font-size: 0.8rem;
            color: $secondary-text-color;

            &:hover {
               color: $input-color;
            }
         }

         &-go {
            color: $input-color;
         }

         &-icon {
            top: 0.35em;
            margin-left: -0.3em;
            margin-right: -0.3em;
         }
      }

      &--error {
         width: 100%;
         background-color: $block-error-color;
         display: flex;
         flex-direction: column;
         align-items: center;
         padding: 1rem 0;
         color: $block-error-text-color;
         font-weight: lighter;
      }

      &--forgot {
         font-size: 0.8rem;
         display: flex;
         width: 100%;
         flex-direction: row;
         justify-content: center;
         color: $secondary-text-color;
         cursor: pointer;

         &-text {
            margin-top: 1rem;
         }

         &:hover {
            color: $input-color;
         }
      }

      &--button {
         margin-top: 6rem;
      }
   }
</style>
