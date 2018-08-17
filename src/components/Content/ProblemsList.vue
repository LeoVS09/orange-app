<template>
  <div class="problems">
    <table class="problems--list">
      <tr class="problems--header">
        <th>Name</th>
        <th>Author</th>
        <th>Upload date</th>
      </tr>
      <tr v-for="item in items" v-on:click="chooseProblem(item)">
        <td>{{item.name}}</td>
        <td>{{item.author}}</td>
        <td class="problems--date">{{uploadDateFormat(item.uploadDate)}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem} from "../../state"

  @Component
  export default class ProblemsList extends Vue {
    // @ts-ignore
    @Getter('openProblems') items: Array<Problem>;

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

  .problems {
    width: 100%;

    &--list {
      width: 100%;
    }

    tr {
      width: 100%;
      display: flex;
      flex-direction: row;
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
      transition: box-shadow 0.2s cubic-bezier(.25,.8,.25,1);

      &:hover {
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
        cursor: pointer;
      }

      &:first-child{
        box-shadow: none;
        cursor: default;
      }

      &.problems--header {
        border-bottom: 1px solid $secondaryColor;
      }

      &:nth-child(even) {
        background-color: rgba(128, 128, 128, 0.1);
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

    &--date {
      text-align: center;
    }
  }
</style>
