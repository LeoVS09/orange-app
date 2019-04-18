<template>
  <div class="top-bar--container">
    <transition name="scroll-down">
      <div v-if="!scrollTop || isScroll" :class="{'top-bar': true, 'scrolled': scrollTop ? isScroll : false }">
        <Logo :click="clickHome" class="top-bar--logo"/>
        <div class="top-bar--menu">
          <span @click="clickProblems">Problems</span>
          <span @click="clickContests">Contests</span>
        </div>
        <div class="top-bar--profile" @click="clickProfile">
          <span class="top-bar--profile-text">{{profileText}}</span>
          <Icon type="menu" class="top-bar--profile-icon"/>
        </div>
      </div>
    </transition>
    <transition name="fade-down">
      <div
        v-if="isProfileActionsHover && !!userData && (isScroll || !scrollTop)"
        class="top-bar--profile-actions-back">
        <div class="top-bar--profile-actions">
          <ul>
            <li @click="clickProfile">Profile</li>
            <li @click="clickSignOut">Sign Out</li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop} from 'vue-property-decorator'
  import {Logo, Icon} from '../components'
  import {Getter} from 'vuex-class'
  import {User} from "../state"
  import * as actions from '../store/actionTypes';
  import {checkIsLogin} from '../identity'

  function isHover(x: number, y: number, maxX: number, maxY: number, limit: number = 0.25) {

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

    @Getter('profile') userData?: User;

    @Prop({
      type: Boolean,
      default: false
    })
    showProfileActions = false;

    isProfileActionsHover = this.showProfileActions;
    isScroll = false;
    scrollTop = 0;

    created() {
      // @ts-ignore
      mousemoveListener = (event: MouseEvent) => {
        let el: HTMLElement | null = document.querySelector('html');
        if (!el) {
          console.error("Unexpected error");
          return
        }

        if (this.isProfileActionsHover) {
          if (!isHover(event.pageX, event.pageY - el.scrollTop, el.offsetWidth, el.offsetHeight)) {
            this.endHoverProfile();
          }
        } else {
          if (isHover(event.pageX, event.pageY - el.scrollTop, el.offsetWidth, el.offsetHeight, 0.1)) {
            this.startHoverProfile();
          }
        }
      };

      document.addEventListener("mousemove", mousemoveListener)

      let oldScroll = 0;
      window.onscroll = () => {
        let el: HTMLElement | null = document.querySelector('html');
        if (!el) {
          console.error("Unexpected error");
          return
        }

        if (oldScroll - el.scrollTop > 0) {
          this.startScroll(el.scrollTop)
        } else {
          this.endScroll(el.scrollTop)
        }

        oldScroll = el.scrollTop;
      }
    }

    beforeDestroy() {
      document.removeEventListener("mousemove", mousemoveListener)
    }

    clickHome() {
      this.$router.push({name: 'home'});
    }

    clickProblems() {
      this.$router.push({name: 'home'});
    }

    clickContests() {
      console.log("clickContests")
    }

    get profileText() {
      if (!this.userData) {
        return 'Sign In'
      }

      let name = this.userData.firstName;
      name = name[0].toUpperCase() + name.slice(1);

      return name;
    }

    calcShowProfileActions(){
      return this.isProfileActionsHover && !!this.userData && (this.isScroll || !this.scrollTop)
    }

    startHoverProfile() {
      if (this.userData) {
        this.isProfileActionsHover = true;
        this.showProfileActions = this.calcShowProfileActions();
        this.$emit("update:showProfileActions", this.showProfileActions);
      }
    }

    endHoverProfile() {
      this.isProfileActionsHover = false;
      this.showProfileActions = this.calcShowProfileActions();
      this.$emit("update:showProfileActions", this.showProfileActions);
    }

    startScroll(top: number) {
      this.isScroll = true;
      this.scrollTop = top;
    }

    endScroll(top: number) {
      this.isScroll = false;
      this.scrollTop = top;
    }

    clickProfile() {
      if (this.userData) {
        this.$router.push({name: 'profile'})
      } else {
        this.$router.push({name: 'signin'});
      }
    }

    clickSignOut() {
      this.$store.dispatch(actions.LOGOUT_FROM_PROFILE);
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .top-bar {
    position: fixed;
    top: 0;
    width: 100%;
    height: $top-bar-height;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: $background-color;
    z-index: 20;
    transition: all 0.15s;

    &.scrolled {
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    &--logo {
      margin-left: 1rem;
      margin-top: 0.1rem;
      margin-bottom: 0.2rem;
    }

    &--menu {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      color: $menu-text-color;
      padding: 0 1rem;
      font-family: "Montserrat", sans-serif;
      font-weight: bold;

      span {
        cursor: pointer;
        border-bottom: 2px solid transparent;

        &:hover {
          color: $active-color;
          border-bottom-color: $active-color;
        }
      }
    }

    &--profile {
      margin-right: 1rem;
      margin-top: 0.3rem;
      cursor: pointer;
      font-size: 1.7rem;

      &-text {
        color: $secondary-text-color;
        font-size: 0.8rem;
        position: relative;
        top: -0.3em;

        &:hover {
          color: $active-color
        }
      }

      &-actions-back {
        position: fixed;
        top: $top-bar-height;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 19;

        background: linear-gradient(45deg, rgba(253, 161, 48, 0.06) 0%, rgba(253, 116, 0, 0.51) 40%, #ff6977 100%);
      }

      &-actions {
        font-size: 1.3rem;
        border-radius: 0.3rem;
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;

        ul {
          padding: 0;
          list-style: none;
          margin: 2rem 2rem 0 0;

          li {
            padding: 0.5rem 2rem;
            color: white;
            margin-top: 1rem;

            &:hover {
              text-decoration: underline;
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
  }

  .scroll-down-enter, .scroll-down-leave-to {
    top: -3rem;
  }
</style>
