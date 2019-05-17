<template>
   <div class="problems">
      <PageHeader class="problems--header">Problems</PageHeader>
      <div class="problems--content">

         <div class="problems--actions">
            <Button
               v-if="isTeacher"
               icon="add"
               @click="addProblem"
               class="problems--add-button"
               :primary="true"
               :circle="true"
            >Add problem</Button>
            <ButtonGroup v-slot="group">
               <Button
                  @click="viewAll"
                  :active="filter === 'All'"
                  class="problems--filter-item"
                  :hovered="group.hovered"
                  :gradientHighlight="false"
               >All</Button>
               <Button
                  @click="viewOpen"
                  :active="filter === 'Open'"
                  class="problems--filter-item"
                  :hovered="group.hovered"
                  :gradientHighlight="false"
               >Open</Button>
               <Button
                  @click="viewClosed"
                  :active="filter === 'Closed'"
                  class="problems--filter-item"
                  :hovered="group.hovered"
                  :gradientHighlight="false"
               >Closed</Button>
               <Button
                  @click="viewResolved"
                  :active="filter === 'Resolved'"
                  class="problems--filter-item"
                  :hovered="group.hovered"
                  :gradientHighlight="false"
               >Resolved</Button>
            </ButtonGroup>
         </div>

         <list
            :headers="[
               {key: 'name', label: 'Name'},
               {key: 'author', label: 'Author'},
               {key: 'date', label: 'Date'},
            ]"
            :items="filtered"
            :formatData="formatItem"
            :isCanAdd="isTeacher"
            @chooseItem="chooseProblem"
         />
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter, Action} from 'vuex-class'
   import {FullProblem} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, ProblemListItem, Button, ButtonGroup, List} from '@/components';
   import {ROUTES} from '@/router'

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
         Button,
         ButtonGroup,
         List
      }
   })
   export default class ProblemsList extends Vue {

      @Getter problems: Array<FullProblem>;
      @Getter openProblems: Array<FullProblem>;
      @Getter closedProblems: Array<FullProblem>;

      @Getter isTeacher: boolean;

      @Action(actions.READ_PROBLEMS_LIST) syncProblems?: () => void

      filter = Filter.All;

      get filtered() {
         if (this.filter === Filter.All) {
            return this.problems
         }

         if (this.filter === Filter.Open) {
            return this.openProblems
         }

         if (this.filter === Filter.Closed) {
            return this.closedProblems
         }

         return this.problems
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

      formatItem(item: FullProblem){
         return {
            ...item,
            date: item.updatedAt ? item.updatedAt : item.createdAt,
            author: item.author.login
         }
      }

      created() {
         if (!this.syncProblems)
            return console.error('Not have action to sync problems')

         this.syncProblems()
      }

      addProblem() {
         this.$router.push({name: ROUTES.CREATE_PROBLEM});
      }

      chooseProblem(problem: FullProblem) {

         this.$router.push({
            name: ROUTES.PROBLEM,
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

      &--actions {
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

      &--add-button {
         margin-right: auto;
         display: flex;
         flex-direction: row;
         justify-content: flex-end;

      }

   }
</style>
