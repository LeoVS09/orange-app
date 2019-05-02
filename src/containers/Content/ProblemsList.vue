<template>
   <div class="problems">
      <PageHeader class="problems--header">Problems</PageHeader>
      <div class="problems--content">
         <div class="problems--add" v-if="isTeacher">
            <Button icon="add" :click="addProblem" class="problems--add-button">Add problem</Button>
         </div>

         <div class="problems--filters">
            <Button
               :click="viewAll"
               :active="filter === 'All'"
               class="problems--filter-item"
            >All
            </Button>
            <Button
               :click="viewOpen"
               :active="filter === 'Open'"
               class="problems--filter-item"
            >Open
            </Button>
            <Button
               :click="viewClosed"
               :active="filter === 'Closed'"
               class="problems--filter-item"
            >Closed
            </Button>
            <Button
               :click="viewResolved"
               :active="filter === 'Resolved'"
               class="problems--filter-item"
            >Resolved
            </Button>
         </div>

         <table class="problems--list">
            <tr class="problems--list-header">
               <th>Name</th>
               <th>Author</th>
               <th>Date</th>
            </tr>
            <tbody name="list-item-down" is="transition-group" mode="out-in">
            <ListItem v-for="item in filtered" v-on:click.native="chooseProblem(item)"
                      v-bind:key="item.name + item.author" :item="item"/>
            </tbody>
         </table>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter, Action} from 'vuex-class'
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

      @Getter('problems') items: Array<Problem>;

      @Getter isTeacher: boolean;

      @Action(actions.SYNC_PROBLEMS) syncProblems?: () => void

      filter = Filter.All;

      get filtered() {
         if (this.filter === Filter.All) {
            return this.items
         }

         if (this.filter === Filter.Open) {
            return this.items.filter(p => p.isOpen)
         }

         if (this.filter === Filter.Closed) {
            return this.items.filter(p => !p.isOpen)
         }

         return this.items
      }

      viewAll() {
         this.filter = Filter.All
      }

      viewOpen() {
         this.filter = Filter.Open
      }

      viewClosed() {
         this.filter = Filter.Closed
      }

      viewResolved() {
         this.filter = Filter.Resolved
      }

      created() {
         if (!this.syncProblems)
            return console.error('Not have action to sync problems')

         this.syncProblems()
      }

      addProblem() {
         this.$router.push({name: 'create problem'});
      }

      chooseProblem(problem: Problem) {
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

      &--content {
         display: flex;
         flex-direction: column;
         justify-content: center;
         width: 100%;
         margin: 0 auto;
         padding: 0 $content-padding-sides;
         box-sizing: border-box;
         max-width: $max-content-width;
      }

      &--filters {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-end;
         margin-bottom: 1rem;
         margin-top: 1rem;
         margin-left: 0;
      }

      &--filter-item {
         margin-right: 1rem;

         &:last-child {
            margin-right: 0;
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
         padding-top: 1.5*$problem-line-padding;
         padding-bottom: 1.5*$problem-line-padding;
         transition: box-shadow 0.2s cubic-bezier(.25, .8, .25, 1);
         border-bottom: 1px solid $secondary-color;

         &, &:hover {
            box-shadow: none;
            cursor: default;
            color: $main-text-color;
         }

         td, th {
            flex: 1;

            &:first-child {
               flex: 3;
               padding-left: 1rem;
               text-underline: $main-text-color;
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
