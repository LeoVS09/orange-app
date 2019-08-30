<template>
   <div id="app">
      <router-view></router-view>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import * as actions from './store/actionTypes'
import eventBus, { AuthorisationEventPayload, AuthorisationEventState, BusEventTypes } from '@/pages/eventBus'

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate',
])

@Component
export default class App extends Vue {
   @Action(actions.INIT_PROFILE) public initProfile!: () => Promise<boolean>;

   public created() {
     this.initProfile()
       .then((result) => {
         if (!result)
           return

         const payload: AuthorisationEventPayload = {
           state: AuthorisationEventState.Completed,
         }
         eventBus.$emit(BusEventTypes.Authorisation, payload)
       })
   }
}
</script>

<style lang="scss">
   @import url('https://fonts.googleapis.com/css?family=Roboto:100,400,700');
   @import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
   @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro');
   @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
   @import url('https://fonts.googleapis.com/css?family=IBM+Plex+Mono');
   @import "./styles/config.scss";
   @import "./styles/default.scss";

   #app {
      width: 100%;
      height: 100%;
   }

</style>
