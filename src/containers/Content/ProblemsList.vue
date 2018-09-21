<template>
  <div class="problems">
    <PageHeader class="problems--header">Problems</PageHeader>
    <div class="problems--content">
      <div class="problems--add">
        <Button icon="add" :click="addProblem" class="problems--add-button">Add problem</Button>
      </div>

      <div class="problems--filters">
        <p :class="{active: filter === 'All'}" @click="viewAll">All</p>
        <p :class="{active: filter === 'Open'}" @click="viewOpen">Open</p>
        <p :class="{active: filter === 'Closed'}" @click="viewClosed">Closed</p>
        <p :class="{active: filter === 'Resolved'}" @click="viewResolved">Resolved</p>
      </div>

      <table class="problems--list">
        <tr class="problems--list-header">
          <th>Name</th>
          <th>Author</th>
          <th>Upload date</th>
        </tr>
        <tbody name="list-item-down" is="transition-group" mode="out-in">
          <ListItem v-for="item in filtered" v-on:click.native="chooseProblem(item)" v-bind:key="item.name + item.author" :item="item" />
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
  import {PageHeader, ProblemListItem, Button} from '../../components';

  enum Filter {
    All = "All",
    Open = "Open",
    Closed = "Closed",
    Resolved = "Resolved"
  }

  @Component({
    components: {
      PageHeader,
      ListItem: ProblemListItem,
      Button
    }
  })
  export default class ProblemsList extends Vue {
    // @ts-ignore
    @Getter('problems') items: Array<Problem>;
    // @ts-ignore
    @Getter isTeacher: boolean;

    filter = Filter.All;

    get filtered() {
      if(this.filter === Filter.All) {
        return this.items
      }

      if(this.filter === Filter.Open) {
        return this.items.filter(p => p.isOpen)
      }

      if(this.filter === Filter.Closed) {
        return this.items.filter(p => !p.isOpen)
      }

      return this.items
    }

    viewAll(){
      this.filter = Filter.All
    }

    viewOpen(){
      this.filter = Filter.Open
    }

    viewClosed(){
      this.filter = Filter.Closed
    }

    viewResolved(){
      this.filter = Filter.Resolved
    }

    created() {
      this.$store.dispatch(actions.SET_STANDARD_PAGE);
      this.$store.dispatch(actions.SYNC_PROBLEMS);
    }

    addProblem(){
      this.$router.push({name: 'create problem'});
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

    &--header {
      margin-top: 0;
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

    &--add {
      &-button {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    }

    &--list {
      width: 100%;
      margin: 0;
      padding: 0;
    }

    &--list-header {
      width: 100%;
      display: flex;
      flex-direction: row;
      border-top: 1px solid $secondaryColor;
      padding-top: 1.5*$problemLinePadding;
      padding-bottom: 1.5*$problemLinePadding;
      transition: box-shadow 0.2s cubic-bezier(.25,.8,.25,1);
      border-bottom: 1px solid $secondaryColor;

      &, &:hover {
        box-shadow: none;
        cursor: default;
        color: $mainTextColor;
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


    .list-item-down-enter-active {
      transition: all 0.2s;
    }

    .list-item-down-leave-active {
      transition: all 0.05s;
    }

    .list-item-down-enter {
      opacity: 0;
      transform: translateY(-1rem);
    }
    .list-item-down-leave-to {
      opacity: 0;
    }

  }
</style>
