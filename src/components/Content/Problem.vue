<template>
  <div v-if="!!problemData" class="problem">
    <h1>{{problemData.name}}</h1>
    <p>{{problemData.text}}</p>
    <p v-for="example in problemData.examples">{{example}}</p>
    <p>Upload date: {{problemData.uploadDate.toLocaleString()}}</p>
    <p>Publication date: {{problemData.publicationDate.toLocaleString()}}</p>
    <p>Author: {{problemData.author}}</p>
    <p>Tester: {{problemData.tester}}</p>
    <p>Tags: <span
      v-for="tag in problemData.tags"
      class="problem--tag"
    >{{tag}}</span>
    </p>
  </div>
  <h1 v-else>Some error</h1>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem} from "../../state"

  @Component
  export default class ProblemView extends Vue {
    // @ts-ignore
    @Getter('problems') items: Array<Problem>;

    beforeRouteUpdate(to: any, from: any, next: any){
      // TODO: handle when problem changed
      next();
    }

    get problemData(): Problem | null {
      const items = this.items;
      console.log("Problem items:", items);
      if(!items || !items.length){
        return null;
      }
      console.log("Problem params id", this.$route.params.id);
      return items.filter(p => p.id === this.$route.params.id)[0];
    }

  }
</script>

<style lang="scss" scoped>
  .problem {
    &--tag {
      margin-right: 2rem;
    }
  }
</style>
