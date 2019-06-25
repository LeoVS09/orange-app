<template>
   <div class="signup">
      <div class="signup--in">
         <div class="signup--in-link" @click="clickLogin">
            <span class="signup-in-text">Have profile? <span class="signup--in-go">Sign In</span> now!</span>
         </div>
      </div>
      <h2 class="signup--header">Create account</h2>

      <Input type="text" placeholder="First Name" @keyup.enter.native="clickRegister" v-model="firstName"
             :error="isFirstNameError" :tabindex="1" :disabled="isDisabled"/>
      <Input type="text" placeholder="Last Name" @keyup.enter.native="clickRegister" v-model="lastName"
             :error="isLastNameError" :tabindex="2" :disabled="isDisabled"/>

      <div class="signup--delimiter"></div>

      <Input type="text" placeholder="Email" @keyup.enter.native="clickRegister" v-model="email"
             :error="isEmailError" :tabindex="3" :autofocus="true" :disabled="isDisabled"/>

      <Input type="text" placeholder="Login" @keyup.enter.native="clickRegister" :value="login"
             @input="value => username = value"
             :error="isUsernameError" :tabindex="3" :autofocus="true" :disabled="isDisabled"/>

      <div class="signup--delimiter"></div>

      <Input type="password" placeholder="Password" @keyup.enter.native="clickRegister" v-model="password"
             :error="isPasswordError" :tabindex="4" :disabled="isDisabled"/>
      <Input type="password" placeholder="Confirm Password" @keyup.enter.native="clickRegister"
             v-model="confirmPassword" :error="isConfirmPasswordError" :tabindex="5" :disabled="isDisabled"/>

      <p class="signup--agreement">We promise don't publish this information.</p>

      <Button
         :tabindex="6"
         @click="clickRegister"
         class="signup--button"
         :disabled="isDisabled"
         :primary="true"
         :gradient-highlight="false"
      >Sign Up
      </Button>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Watch} from 'vue-property-decorator'
   import {Action} from 'vuex-class'
   import {Logo, Input, Button, Checkbox, MaterialIcon} from '../components'
   import * as actions from '../store/actionTypes';
   import {ROUTES} from "@/router";
   import {IRegisterProfilePayload} from "@/store/modules/profile/types";
   import eventBus, {AuthorisationEventPayload, AuthorisationEventState, BusEventTypes} from "@/pages/eventBus";

   @Component({
      components: {
         Logo,
         Input,
         Button,
         Checkbox,
         Icon: MaterialIcon
      }
   })
   export default class SignUp extends Vue {

      @Action(actions.SET_SIGN_UP_PAGE) setSignUpPage: () => void
      @Action(actions.REGISTER_PROFILE) registerProfile: (payload: IRegisterProfilePayload) => Promise<boolean>

      email = "";
      isEmailError: boolean | string = false;

      username = "";
      isUsernameError: boolean | string = false;

      password = "";
      isPasswordError: boolean | string = false;

      confirmPassword = "";
      isConfirmPasswordError: boolean | string = false;

      firstName = "";
      isFirstNameError: boolean | string = false;

      lastName = "";
      isLastNameError: boolean | string = false;

      isDisabled = false;

      get login() {
         const isLoginHaveOnlyAllowedSymbols = (login: string) => !!login.match(/^[a-zA-Z]([a-zA-Z0-9][_]?)+$/)

         const extractLogin = () => {
            if (this.username)
               return this.username

            return this.email.split('@')[0]
         }

         const login = extractLogin()
         if (login.length < 2)
            return login

         if (!isLoginHaveOnlyAllowedSymbols(login))
            this.isUsernameError = 'Login should contain only letters, digits and "_"'
         else
            this.isUsernameError = false

         return login
      }

      created() {
         this.setSignUpPage();
      }

      clickLogin() {
         this.$router.push({name: ROUTES.SIGNIN});
      }

      clickRegister() {
         if (
            this.isEmailError ||
            this.isUsernameError ||
            this.isPasswordError ||
            this.isConfirmPasswordError ||
            this.isFirstNameError ||
            this.isLastNameError ||
            this.isDisabled
         )
            return console.error('Have input error, or disabled')

         this.isDisabled = true;

         this.registerProfile({
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            email: this.email,
            username: this.login
         }).then(result => {
            this.isDisabled = false;
            if (result) {
               const payload: AuthorisationEventPayload = {
                  state: AuthorisationEventState.Completed
               }
               eventBus.$emit(BusEventTypes.Authorisation, payload)
            }
         }).catch(error => {
            this.isDisabled = false;
            console.error(error)
         });
      }

      @Watch('confirmPassword')
      checkPassword(value: string, oldValue: string) {

         if (!value.length) {
            this.isConfirmPasswordError = false;
            return
         }

         if (value !== this.password) {
            this.isConfirmPasswordError = "Passwords don't match";
            return
         }

         this.isConfirmPasswordError = false;
      }

   }
</script>

<style scoped lang="scss">
   @import "../styles/config";

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
      }

      &--agreement {
         color: $secondary-text-color;
         font-size: 0.9rem;
      }

      &--button {
         margin-top: 2rem;
      }
   }
</style>
