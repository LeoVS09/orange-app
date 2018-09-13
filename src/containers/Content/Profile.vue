<template>
  <div class="profile">
    <PageHeader class="profile--header">Hello, {{name}}</PageHeader>

    <aside class="profile--sidebar">
      <p class="profile--sidebar-link active">Information</p>
      <p class="profile--sidebar-link">Teams</p>
      <p class="profile--sidebar-link">Sign Out</p>
    </aside>

    <div class="profile--content">
      <Input type="text" placeholder="First Name" :value.sync="firstName" :error.sync="isFirstNameError" :tabindex="1" :disabled="isDisabled"/>
      <Input type="text" placeholder="Family Name" :value.sync="familyName" :error.sync="isFamilyNameError" :tabindex="2" :disabled="isDisabled"/>
      <Input type="text" placeholder="Last Name" :value.sync="lastName" :error.sync="isLastNameError" :tabindex="3" :disabled="isDisabled"/>

      <div class="profile--delimiter"></div>

      <Input type="text" placeholder="Email" :value.sync="email" :error.sync="isEmailError" :tabindex="4" :autofocus="true" :disabled="isDisabled"/>

      <div class="profile--delimiter"></div>

      <Input type="password" placeholder="Old password" :value.sync="oldPassword" :error.sync="isOldPasswordError" :tabindex="5" :disabled="isDisabled"/>
      <Input type="password" placeholder="New Password" :value.sync="newPassword" :error.sync="isNewPasswordError" :tabindex="6" :disabled="isDisabled"/>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {User} from "../../state"
  import * as actions from '../../store/actionTypes';
  import {checkIsLogin} from '../../identity'
  import {SourceView, Icon, Input, PageHeader} from '../../components';

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
      PageHeader
    }
  })
  export default class Profile extends Vue {
    // @ts-ignore
    @Getter('profile') userData: User;

    email = "";
    isEmailError = false;

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

    isDisabled = false;

    created() {
      this.$store.dispatch(actions.SET_STANDARD_PAGE);

      if (!checkIsLogin()) {
        this.$router.push({name: 'signin'});
        return
      }
      if (!this.userData) {
        console.log("User is sign in, but not have data");
        this.$router.push({name: 'home'});
        return
      }

      this.email = this.userData.email || "";
      this.firstName = this.userData.firstName;
      this.familyName = this.userData.familyName || "";
      this.lastName = this.userData.lastName;
    }

    get name(): string {
      let result = capitalise(this.userData.firstName);

      if (this.userData.familyName) {
        result += " " + capitalise(this.userData.familyName);
      }

      result += " " + capitalise(this.userData.lastName);

      return result;
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
      "sidebar content"
      "sidebar content"
      / 1fr 3fr;

    &--header {
      grid-area: header;
    }

    $contentPaddingTop: 1rem;

    &--sidebar {
      grid-area: sidebar;
      display: flex;
      flex-direction: column;
      padding-top: $contentPaddingTop;

      &-link {
        border-right: 1px solid $borderLineColor;
        width: 100%;
        text-align: center;
        cursor: pointer;
        padding: 1rem 0;
        margin-top: 0;
        margin-bottom: 0;

        &:hover {
          color: $activeColor;
        }

        &.active {
          background: linear-gradient(90deg, rgba(0,0,0,0) 30%, lighten($activeColor, 48%) 100%);
          border-right: 1px solid $activeColor;
          color: $activeColor;
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
      margin-top: 2.5rem;
      padding: 0;
    }
  }

</style>
