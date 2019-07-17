<template>
   <div class="top-bar--container">
      <transition name="scroll-down">
         <div v-if="!scrollTop || isScroll" :class="{'top-bar': true, 'scrolled': scrollTop ? isScroll : false }">
            <Logo @click="clickHome" class="top-bar--logo"/>
            <div class="top-bar--menu">
               <Button
                  class="top-bar--item"
                  @click="clickProblems"
                  simple
                  borderHighlight
                  bold
                  maxHeight
                  biggerFont
                  :active="isProblemsRoute"
               >{{'Problems' | translate}}</Button>
               <Button
                  class="top-bar--item"
                  @click="clickContests"
                  simple
                  simpleActive
                  borderHighlight
                  bold
                  maxHeight
                  biggerFont
                  :active="isContestsRoute"
               >{{'Contests' | translate}}</Button>
            </div>
            <div class="top-bar--profile">
               <span class="top-bar--profile-text" @click="clickProfile">{{profileText}}</span>
               <Button
                  simple
                  icon="public"
                  class="top-bar--locale"
                  @click="toggleLocale"
               >{{locale === Translation.RU ? Translation.EN : Translation.RU}}</Button>
               <Button
                  icon="menu"
                  class="top-bar--menu-icon"
                  @click="onMenuIconClick"
                  simple
                  onlyIcon
               />
            </div>
         </div>
      </transition>
      <transition name="fade-down">
         <div
            v-if="isMenuVisible"
            class="top-bar--profile-actions-back">
            <div class="top-bar--profile-actions">
               <ul>
                  <li @click="clickProfile">{{'Profile' | translate}}</li>
                  <li @click="clickCountries">{{'Countries' | translate}}</li>
                  <li @click="clickProgrammingLanguages">{{'Programming languages' | translate}}</li>
                  <li @click="clickSignOut">{{'Sign Out' | translate}}</li>
               </ul>
            </div>
         </div>
      </transition>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import {Button, Logo, MaterialIcon} from '@/components'
   import {Action, Getter} from 'vuex-class'
   import {UserProfile} from "@/models"
   import {ROUTES} from '@/router'
   import {IListener, onPredictiveHover, onScroll} from "@/components/predictive";
   import {Translation} from "@/store/modules/ui/state";
   import * as actions from '@/store/actionTypes'
   import {RouterPush} from "@/components/decorators";

   // TODO: use router links

   let mousemoveListener: IListener

   @Component({
      components: {
         Icon: MaterialIcon,
         Logo,
         Button
      }
   })
   export default class TopBar extends Vue {

      @Prop({
         type: Boolean,
         default: false
      })
      showProfileActions: boolean;

      @Getter('profile') userData?: UserProfile;

      @Getter locale: Translation

      @Action(actions.SET_LOCALE) setLocale: (locale: Translation) => void

      isProfileActionsHover = this.showProfileActions;
      isScroll = false;
      scrollTop = 0;
      isActionCompleted = false;

      ROUTES = ROUTES
      Translation = Translation

      created() {
         mousemoveListener = onPredictiveHover(
            () => this.startHoverProfile(),
            () => this.endHoverProfile()
         )

         onScroll(
            top => this.startScroll(top),
            top => this.endScroll(top)
         )
      }

      beforeDestroy() {
         mousemoveListener.destroy()
      }

      get profileText() {
         if (!this.userData) {
            return this.$t('Sign In')
         }

         let name = this.userData.firstName;
         name = name[0].toUpperCase() + name.slice(1);

         return name;
      }

      get isMenuVisible() {
         return this.isProfileActionsHover &&
            !this.isActionCompleted &&
            !!this.userData &&
            (this.isScroll || !this.scrollTop)
      }

      onMenuIconClick(){
         console.log('click')
         // TODO
      }

      startHoverProfile(): boolean {
         if (!this.userData)
            return this.isProfileActionsHover

         this.isProfileActionsHover = true;
         const showProfileActions = this.isMenuVisible;
         this.$emit("update:is-menu-visible", showProfileActions);

         return this.isProfileActionsHover
      }

      endHoverProfile() {
         this.isProfileActionsHover = false;
         this.isActionCompleted = false;
         const showProfileActions = this.isMenuVisible;
         this.$emit("update:is-menu-visible", showProfileActions);

         return this.isProfileActionsHover
      }

      startScroll(top: number) {
         this.isScroll = true;
         this.scrollTop = top;
      }

      endScroll(top: number) {
         this.isScroll = false;
         this.scrollTop = top;
      }

      @RouterPush(ROUTES.HOME)
      clickHome: () => void

      get isProblemsRoute(){
         return this.$route.name === ROUTES.PROBLEMS
      }

      get isContestsRoute(){
         return this.$route.name === ROUTES.CONTESTS
      }

      @RouterPush(ROUTES.PROBLEMS)
      clickProblems: () => void

      @RouterPush(ROUTES.CONTESTS)
      clickContests: () => void

      clickProfile() {
         if (this.userData) {
            this.$router.push({name: ROUTES.PROFILE})
         } else {
            this.$router.push({name: ROUTES.SIGNIN});
         }
         this.isActionCompleted = true;
      }

      @RouterPush(ROUTES.COUNTRIES)
      clickCountries: () => void

      @RouterPush(ROUTES.PROGRAMMING_LANGUAGES)
      clickProgrammingLanguages: () => void

      clickSignOut() {
         this.$store.dispatch(actions.LOGOUT_FROM_PROFILE);
         this.isActionCompleted = true;
      }

      toggleLocale(){
         if(this.locale === Translation.RU)
            this.setLocale(Translation.EN)
         else
            this.setLocale(Translation.RU)
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

      &--item {
         font-size: 1.1rem;
      }

      &--locale {
         position: relative;
         top: -0.15rem;
      }

      &--profile {
         margin-right: 1rem;
         margin-top: 0.3rem;
         display: flex;
         flex-direction: row;
         font-size: 1.7rem;
         align-items: baseline;

         &-text {
            color: $secondary-text-color;
            font-size: 0.8rem;
            padding: 0 0.3rem;
            cursor: pointer;
            position: relative;
            top: -0.2rem;

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
