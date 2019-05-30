<template>
   <main>
      <div class="auth">
         <div :class="{'auth--container': true, 'signin': isSignInPage}">
            <p class="auth--description">Welcome to</p>
            <Logo :click="clickHome" class="auth--logo" :isAuth="true"/>
            <router-view></router-view>
         </div>
      </div>
   </main>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter} from 'vuex-class'
   import {Logo, Input, Button} from '@/components'
   import eventBus, {BusEventTypes, AuthorisationEventPayload, AuthorisationEventState} from "@/pages/eventBus";
   import {ROUTES} from "@/router";
   // TODO: add transition between pages change

   @Component({
      components: {
         Logo,
         Input,
         Button
      }
   })
   export default class Authorisation extends Vue {

      // @ts-ignore
      @Getter('isSignInPage') isSignInPage: boolean;
      isRemember = true;
      login = "";
      password = "";

      clickRemember() {
         this.isRemember = !this.isRemember;
      }

      clickHome() {
         this.$router.push({name: ROUTES.HOME});
      }

      created(){
         eventBus.$on(BusEventTypes.Authorisation, (payload: AuthorisationEventPayload) => {
            switch (payload.state) {
               case AuthorisationEventState.Completed:
                  console.log('route', this.$route)
                  let name = this.$route.query.from
                  if(!name)
                     name = ROUTES.HOME
                  this.$router.push({ name })
                  return
            }

            console.error('Unexpected authorisation state', payload)
         })
      }

      mounted() {
         console.log('route', this.$route)
      }

   }

</script>

<style scoped lang="scss">
   @import "../styles/config";

   main {
      background: linear-gradient(135deg, #fdc020, #fd8320, #ff6977);
      height: 100%;
      width: 100%;
   }

   .auth {
      width: 100%;
      height: 100%;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;


      &--container {
         box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.4);
         width: 100%;
         margin: auto;
         display: flex;
         flex-direction: column;
         align-items: center;
         padding-top: 3rem;
         padding-bottom: 5rem;
         background-color: white;
         max-width: $input-width + 6rem;

         &.signin {
            margin-bottom: auto;
         }
      }

      &--description {
         margin-bottom: 0;
         position: relative;
         left: -2.5rem;
         color: $secondary-text-color;
         top: 1rem;
      }

      &--logo {
         margin-top: 0;
         font-size: 3rem;
         margin-bottom: 0;
      }

   }
</style>
