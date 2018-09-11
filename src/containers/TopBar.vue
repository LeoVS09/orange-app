<template>
  <div class="top-bar--container">
    <div class="top-bar">
      <Logo @click.native="clickHome" class="top-bar--logo" />
      <div class="top-bar--profile" >
        <span class="top-bar--profile-text" @click="clickProfile">{{profileText}}</span>
        <Icon type="account_circle" @click="clickProfile" class="top-bar--profile-icon"/>
      </div>
    </div>
    <transition name="fade-down">
      <div v-if="isViewProfileActions" class="top-bar--profile-actions">
        <ul>
          <li @click="clickProfile">Profile</li>
          <li @click="clickSignOut">Sign Out</li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Logo, Icon} from '../components'
  import {Getter} from 'vuex-class'
  import {User} from "../state"
  import * as actions from '../store/actionTypes';
  import {checkIsLogin} from '../identity'

  function isHover(x: number, y: number, maxX: number, maxY: number) {

    const limit = 0.25;
    let isSideXHovered = x / (maxX + 0.0) > (1 - limit);
    let isSideYHovered = y / (maxY + 0.0) < (limit);

    return isSideXHovered && isSideYHovered;
  }

  let mousemoveListener: EventListener;

  @Component({
    components: {
      Icon,
      Logo
    }
  })
  export default class TopBar extends Vue {
    // @ts-ignore
    @Getter('profile') userData?: User;

    isViewProfileActions = false;

    created(){
      // @ts-ignore
      mousemoveListener = (event: MouseEvent) => {
        let el: HTMLElement | null = document.querySelector('html');
        if(!el) {
          console.error("Unexpected error");
          return
        }

        if(this.isViewProfileActions){
          if(!isHover(event.pageX, event.pageY - el.scrollTop, el.offsetWidth, el.offsetHeight)){
            this.endHoverProfile();
          }
        }else {
          if(isHover(event.pageX, event.pageY - el.scrollTop, el.offsetWidth, el.offsetHeight)){
            this.startHoverProfile();
          }
        }
      };

      document.addEventListener("mousemove", mousemoveListener)
    }

    beforeDestroy(){

      document.removeEventListener("mousemove", mousemoveListener)
    }

    clickHome(){
      this.$router.push({ name: 'home' });
    }

    get profileText(){
      if(checkIsLogin()){
        if(!this.userData){
          return 'Profile'
        }
        let name = this.userData.firstName;
        name = name[0].toUpperCase() + name.slice(1);
        return name;
      }
      return 'Sign In';
    }

    startHoverProfile(){
      if(checkIsLogin()){
        this.isViewProfileActions = true;
      }
    }

    endHoverProfile(){
      this.isViewProfileActions = false;
    }

    clickProfile() {
      if(checkIsLogin()){
        this.$router.push({ name: 'profile' })
      }else {
        this.$router.push({name: 'signin'});
      }
    }

    clickSignOut() {
      this.$store.dispatch(actions.LOGOUT_FROM_PROFILE);
      this.$router.go(0);
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .top-bar {
    position: fixed;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    top: 0;
    width: 100%;
    height: $topBarHeight;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: $backgroundColor;
    z-index: 20;

    &--logo {
      margin-left: 1rem;
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
    }

    &--profile {
      margin-right: 1rem;
      margin-top: 0.3rem;

      font-size: 1.7rem;

      &-text {
        color: $secondaryTextColor;
        font-size: 0.8rem;
        position: relative;
        top: -0.3em;
        cursor: pointer;

        &:hover {
          color: $activeColor
        }
      }

      &-icon {
        cursor: pointer;
      }

      &-actions {
        font-size: 0.9rem;
        position: fixed;
        top: $topBarHeight + 0.5rem;
        right: 0.5rem;
        background-color: $backgroundColor;
        box-shadow: 0 0 6px rgba(0,0,0,0.23);
        border-radius: 0.3rem;
        cursor: pointer;
        z-index: 19;

        ul {
          padding: 0;
          margin: 0;
          list-style: none;

          li {
            padding: 0.5rem 2rem;

            &:last-child {
              border-top: 1px solid #bfbfbf;
            }

            &:hover {
              background-color: rgba(0,0,0, 0.05);
            }
          }
        }
      }
    }
  }

  .fade-down-enter-active, .fade-down-leave-active {
    transition: all .3s;
  }
  .fade-down-enter, .fade-down-leave-to {
    opacity: 0;
    top: -5rem;
  }
</style>
