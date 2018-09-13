<template>
  <div class="problems">
    <PageHeader class="problems--header">Problems</PageHeader>
    <div class="problems--content">
      <div class="problems--filters">
        <p class="active">All</p>
        <p>Open</p>
        <p>Closed</p>
        <p>Resolved</p>
      </div>
      <table class="problems--list">
        <tr class="problems--list-header">
          <th>Name</th>
          <th>Author</th>
          <th>Upload date</th>
        </tr>
        <tbody name="list-item-down" is="transition-group">
          <tr v-for="item in items" v-on:click="chooseProblem(item)" v-bind:key="item.name + item.author" class="problems--problem">
            <td>{{item.name}}</td>
            <td class="problems--author">{{item.author}}</td>
            <td class="problems--date">{{uploadDateFormat(item.uploadDate)}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem} from "../../state"
  import * as actions from '../../store/actionTypes';
  import {PageHeader} from '../../components';

  @Component({
    components: {
      PageHeader
    }
  })
  export default class ProblemsList extends Vue {
    // @ts-ignore
    @Getter('openProblems') items: Array<Problem>;

    created() {
      this.$store.dispatch(actions.SET_STANDARD_PAGE);
      this.$store.dispatch(actions.SYNC_PROBLEMS);
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

    &--header {
      margin-top: 1rem;
      margin-bottom: 3rem;
    }

    &--content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      margin: 0 auto;
      padding: 0 $contentPaddingSides;
      box-sizing: border-box;
      max-width: $maxContentWidth;
    }

    &--filters {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      color: $primaryTextColor;
      margin-bottom: -2px;
      margin-left: 0;


      p {
        padding: 0.1rem 2.5rem;
        margin-top: 0.9rem;
        margin-bottom: 0;
        cursor: pointer;
        transition: box-shadow 0.2s;

        &:last-child {
          border-right: none;
        }

        &:hover {
          color: $activeColor;
          box-shadow: inset 0 -5px 5px -5px $activeColor;
        }

        &.active {
          box-shadow: none;
          background: $activeGradient;
          color: white;
          border-right-color: #ff6977;
          cursor: default;
        }
      }
    }

    &--list {
      width: 100%;
      margin: 0;
      padding: 0;
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
        color: $activeColor;

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

      &, &:hover {
        box-shadow: none;
        cursor: default;
        color: $mainTextColor;
      }
    }

    &--author {
      text-align: center;
    }

    &--date {
      text-align: center;
    }

    .list-item-down-enter-active, .list-item-down-leave-active {
      transition: all 0.2s;
    }
    .list-item-down-enter, .list-item-down-leave-to {
      opacity: 0;
      transform: translateY(-1rem);
    }
  }
</style>
