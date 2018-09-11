<template>
  <div class="problems">
    <h1 class="problems--header">Problems</h1>
    <table class="problems--list">
      <tr class="problems--list-header">
        <th>Name</th>
        <th>Author</th>
        <th>Upload date</th>
      </tr>
      <tr v-for="item in items" v-on:click="chooseProblem(item)" class="problems--problem">
        <td>{{item.name}}</td>
        <td class="problems--author">{{item.author}}</td>
        <td class="problems--date">{{uploadDateFormat(item.uploadDate)}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem} from "../../state/index"
  import * as actions from '../../store/actionTypes';

  @Component
  export default class ProblemsList extends Vue {
    // @ts-ignore
    @Getter('openProblems') items: Array<Problem>;

    created() {
      this.$store.dispatch(actions.SET_STANDARD_PAGE);
    }

    uploadDateFormat(value: number) {
      const date = new Date(value);
      return date.toLocaleDateString()
    }

    chooseProblem(problem: Problem){
      console.log("Go to problem:", problem);
      this.$router.push({
        name: 'problem',
        params: {
          id: problem.id
        }
      })
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../styles/config";

  $linePadding: 0.7rem;

  .problems {
    width: 100%;

    &--list {
      width: 100%;
    }

    &--problem, &--list-header {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding-bottom: $linePadding;
      padding-top: $linePadding;
      transition: box-shadow 0.2s cubic-bezier(.25,.8,.25,1);
      border-bottom: 1px solid $secondaryColor;

      &:hover {
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        cursor: pointer;
      }

      &:first-child{
        box-shadow: none;
        cursor: default;
      }

      td, th {
        flex: 1;

        &:first-child {
          flex: 3;
          padding-left: 1rem;
          text-underline: $mainTextColor;
        }
      }
    }

    &--list-header {
      border-top: 1px solid $secondaryColor;
      border-bottom: 1px solid $secondaryColor;
      padding-top: 1.5*$linePadding;
      padding-bottom: 1.5*$linePadding;
    }

    &--author {
      text-align: center;
    }

    &--date {
      text-align: center;
    }
  }
</style>
