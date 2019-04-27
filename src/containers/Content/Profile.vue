import { UserType } from '@/state'
<template>
  <div class="profile">
    <PageHeader class="profile--header">Hello, {{isTeacher ? 'teacher ' : ''}}{{name}}</PageHeader>

    <aside class="profile--sidebar">
      <p class="profile--sidebar-link active">Information</p>
      <p class="profile--sidebar-link">Teams</p>
      <p class="profile--sidebar-link" @click="clickSignOut">Sign Out</p>
    </aside>

    <div class="profile--content">
      <h4 class="profile--data-header">Public data</h4>
      <Input type="text" placeholder="First Name" v-model="firstName" :error.sync="isFirstNameError" :tabindex="1" :disabled="isDisabled"/>
      <Input type="text" placeholder="Family Name" v-model="familyName" :error.sync="isFamilyNameError" :tabindex="2" :disabled="isDisabled"/>
      <Input type="text" placeholder="Last Name" v-model="lastName" :error.sync="isLastNameError" :tabindex="3" :disabled="isDisabled"/>
      <Input type="text" placeholder="Login" v-model="login" :error.sync="isLoginError" :tabindex="4" :disabled="isDisabled"/>

      <div class="profile--delimiter"></div>
      <h4 class="profile--data-header">Confidential data</h4>
      <Input type="text" placeholder="Email" v-model="email" :error.sync="isEmailError" :tabindex="5" :disabled="isDisabled"/>
			<Select type="text" placeholder="Country" :value="country" textField="name" :items="countries" :error.sync="isCountryError" :tabindex="6" :disabled="isDisabled" />

      <div class="profile--delimiter"></div>
      <h4 class="profile--data-header">Change password</h4>
      <Input type="password" placeholder="Old password" v-model="oldPassword" :error.sync="isOldPasswordError" :tabindex="6" :disabled="isDisabled"/>
      <Input type="password" placeholder="New Password" v-model="newPassword" :error.sync="isNewPasswordError" :tabindex="7" :disabled="isDisabled"/>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter, Action} from 'vuex-class'
  import {User, UserType} from "../../state"
  import * as actions from '../../store/actionTypes';
  import {checkIsLogin} from '../../identity'
  import {Icon, Input, PageHeader, SourceView, Button, Select} from '../../components';
  import {Country} from "@/state/country";

  function capitalise(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }

  Component.registerHooks([
    'beforeRouteUpdate'
  ]);

  @Component({
    components: {
      SourceView,
      Icon,
      Input,
      PageHeader,
			Button,
			Select
    }
  })
  export default class Profile extends Vue {
    // @ts-ignore
    @Getter('profile') userData: Profile;
    // @ts-ignore
    @Getter isTeacher: boolean;

    @Action(actions.SEARCH_COUNTRIES) searchCountriesAction?: (name: string) => Promise<Array<Country>>

    email = "";
    isEmailError = false;

    login = "";
    isLoginError = false;

    oldPassword = "";
    isOldPasswordError = false;

    newPassword = "";
    isNewPasswordError = false;

    firstName = "";
    isFirstNameError = false;

    familyName = "";
    isFamilyNameError = false;

    lastName = "";
    isLastNameError = false;

    country = "";
		countryAutoComplete = [];
    isCountryError = false;

    allCountries: Array<Country> = [];

    isDisabled = false;

    created() {
      if (!this.userData) {
        this.$router.push({name: 'signin'});
        return
      }

      this.email = this.userData.email || "";
      this.login = this.userData.login || "";
      this.firstName = this.userData.firstName;
      this.familyName = this.userData.familyName || "";
      this.lastName = this.userData.lastName;
      this.country = this.userData.country;

      this.searchCountriesAction ? this.searchCountriesAction('')
         .then(countres => this.allCountries = countres) :
         console.error('Not have action searchCountriesAction')
    }

    get name(): string {
      let result = capitalise(this.userData.firstName);

      if (this.userData.familyName) {
        result += " " + capitalise(this.userData.familyName);
      }

      result += " " + capitalise(this.userData.lastName);

      return result;
    }

    clickSignOut(){
      this.$store.dispatch(actions.LOGOUT_FROM_PROFILE);
      this.$router.go(0);
    }

		inputCountry(value: string) {
    	// TODO: validation
    	this.country = value;
			this.$store.dispatch(actions.SEARCH_COUNTRIES, value)
				.then(results => this.countryAutoComplete = results);
		}

    searchCountries(value: string){
    	console.log(value)
			this.country = value;
    	this.$store.dispatch(actions.SEARCH_COUNTRIES, value)
				.then(result => console.log(result));
		}
  }
</script>

<style scoped lang="scss">
  @import "../../styles/config";

  .profile {
    width: 100%;
    height: 100%;
    display: grid;
    grid:
      "header header"
      "sidebar content" 1fr
      / 1fr 3fr;

    &--header {
      grid-area: header;
      height: auto;
    }

    $contentPaddingTop: 1rem;

    &--sidebar {
      grid-area: sidebar;
      display: flex;
      flex-direction: column;
      padding-top: $contentPaddingTop;

      &-link {
        border-right: 1px solid $border-line-color;
        width: 100%;
        text-align: center;
        cursor: pointer;
        padding: 1rem 0;
        margin-top: 0;
        margin-bottom: 0;

        &:hover {
          color: $active-color;
        }

        &.active {
          background: linear-gradient(90deg, rgba(0,0,0,0) 30%, lighten($active-color, 48%) 100%);
          border-right: 1px solid $active-color;
          color: $active-color;
          cursor: default;
        }
      }
    }

    &--content {
      grid-area: content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      padding-top: $contentPaddingTop;
    }

    &--delimiter {
      width: 100%;
      height: 1px;
      margin-top: 4rem;
      padding: 0;
    }

    &--data-header {
      padding: 0;
      text-align: left;
      margin-top: 0;
      margin-bottom: 0;
      width: $input-width;
      color: $secondary-text-color;
    }
  }

</style>
