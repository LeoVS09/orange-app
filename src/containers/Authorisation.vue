<template>
  <main>
    <div class="auth">
      <div class="auth--container">
        <p class="auth--description">Welcome to</p>
        <Logo @click.native="clickHome" class="auth--logo" />
        <div class="auth--login-container">
          <span>Login or Email</span>
          <input type="text" placeholder="Login or Email" class="auth--login" v-on:focus="focusLogin"/>
        </div>
        <div class="auth--password-container">
          <span>Password</span>
          <input type="password" placeholder="Password" class="auth--password" v-on:focus="focusPassword"/>
        </div>
        <div class="auth--remember" @click="clickRemember">
          <span>Remember me</span>
          <div class="auth--remember-checkbox">
            <input type="checkbox" v-model="isRemember"/>
            <label></label>
          </div>
        </div>
        <button class="auth--submit">Sign in</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import { Logo } from '../components'

  @Component({
    components: {
      Logo
    }
  })
  export default class Authorisation extends Vue {

    isRemember = true;
    isLoginEnter = false;
    isPasswordEnter = false;

    clickRemember() {
      this.isRemember = !this.isRemember;
    }

    clickHome(){
      this.$router.push({name: 'home'});
    }

    focusLogin(){
      this.isLoginEnter = !this.isLoginEnter;
    }

    focusPassword(){
      this.isPasswordEnter = !this.isPasswordEnter;
    }
  }

</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  $inputColor: #F57C00;
  $buttonColor: #1976D2;
  $activeColor: #F57C00;

  main {
    background-color: rgba(250, 250, 250, 0.8);
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
      color: rgba(0,0,0,0.7)
    }

    &--logo {
      margin-top: 0;
      font-size: 2.5rem;
      margin-bottom: 3rem;
    }

    &--login-container, &--password-container {
      width: 30rem;
      display: flex;
      flex-direction: column;
      justify-content: left;
      margin-top: 1rem;

      span {
        font-size: 0.7rem;
        color: rgba(0, 0, 0, 0.65);
        //opacity: 0;
        position: relative;
        //bottom: -3rem;
        transition-property: all;
        transition-duration: 0.3s;
      }
    }

    &--login, &--password {
      outline: none;
      margin-top: 0;
      padding: 0.5rem 0.2rem;
      border: none;
      border-bottom: 1px solid gray;
      width: 100%;

      &:active, &:focus {
        border-bottom-color: $inputColor;
      }
    }

    &--remember {
      margin-top: 1rem;
      width: 30rem;
      font-size: 0.8rem;
      $rememberColor: lighten($mainTextColor, 30%);
      color: $rememberColor;
      display: flex;
      flex-direction: row;
      justify-content: start;
      cursor: pointer;
      
      span {
        text-decoration: none;
      }
      
      &-checkbox {
        width: 20px;
        position: relative;
        top: -0.2em;
        margin: 0 0.3rem 0 0.2rem;

        label {
          width: 20px;
          height: 20px;
          cursor: pointer;
          position: absolute;
          top: 0;
          left: 0;
          background: transparent;
          border-radius: 4px;
          font-size: 1rem;
          color: black;
          &:after {
            content: '';
            width: 9px;
            height: 5px;
            position: absolute;
            top: 4px;
            left: 4px;
            border: 3px solid $rememberColor;
            border-top: none;
            border-right: none;
            background: transparent;
            opacity: 0;
            transform: rotate(-45deg);
          }
        }

        input[type=checkbox] {
          visibility: hidden;

          &:checked + label:after {
            opacity: 1;
          }
        }
      }

      &:hover {
        span {
          color: $inputColor;
        }
        .auth--remember-checkbox label:after{
          opacity: 0.3;
          border-color: $inputColor;
        }
      }
    }

    &--submit {
      margin-top: 6rem;
      padding: 0.5rem 5rem;
      border-radius: 1rem;
      background-color: $buttonColor;
      border: none;
      box-shadow: 0 0 3px 0 lighten($buttonColor, 10%);
      color: white;
      cursor: pointer;
      transition-property: box-shadow;
      transition-duration: 0.1s;

      &:hover {

        background-color: lighten($buttonColor, 3%);
        box-shadow: 0 0 10px 0 lighten($buttonColor, 10%);
      }

      &:active {
        background-color: $activeColor;
      }
    }
  }
</style>
