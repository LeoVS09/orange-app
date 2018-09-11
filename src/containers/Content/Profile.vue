<template>
    <div class="profile">
      <h1>Hello, {{userData.firstName}} {{userData.familyName}} {{userData.lastName}}</h1>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {User} from "../../state"
  import * as actions from '../../store/actionTypes';
  import {checkIsLogin} from '../../identity'
  import {SourceView, Icon} from '../../components';

  Component.registerHooks([
    'beforeRouteUpdate'
  ]);

  @Component({
    components: {
      SourceView,
      Icon
    }
  })
  export default class ProblemView extends Vue {
    // @ts-ignore
    @Getter('profile') userData?: User;

    created() {
      this.$store.dispatch(actions.SET_STANDARD_PAGE);

      if(!checkIsLogin()) {
        this.$router.push({name: 'signin'});
        return
      }
      if(!this.userData){
        console.log("User is sign in, but not have data");
        this.$router.push({name: 'home'});
        return
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/config";

</style>
