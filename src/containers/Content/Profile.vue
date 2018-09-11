<template>
    <div class="profile">
      <h1>Hello, {{name}}</h1>
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

  function capitalise(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }

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
    @Getter('profile') userData: User;

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

    get name(): string {
      let result = capitalise(this.userData.firstName);

      if(this.userData.familyName){
        result += " " + capitalise(this.userData.familyName);
      }

      result += " " + capitalise(this.userData.lastName);

      return result;
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/config";

</style>
