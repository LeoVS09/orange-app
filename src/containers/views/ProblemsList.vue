<template>
   <div class="problems">
      <PageHeader class="problems--header">
         <template #text>Problems</template>
         <template #actions>
            <Button
               v-if="isTeacher"
               icon="add"
               @click="addProblem"
               class="problems--add-button"
               :gradient-highlight="false"
               :circle="true"
               :contrast="true"
               :textOnHover="true"
            >Add problem</Button>
         </template>
      </PageHeader>
      <Tags
         :values="allTags"
         @choose="chooseTag"
         :activeTags="activeTags"
      />

      <Section>

         <div class="problems--actions">

            <ButtonGroup
               v-slot="group"
               :hoverAnimation="false"
               :meta="{
                  attributes: {
                     gradientHighlight: true
                  },
                  active: filter,
                  buttons: [
                     { 'All': ProblemFilter.All },
                     { 'Public': ProblemFilter.Public },
                     { 'Not public': ProblemFilter.NotPublic },
                     { 'Resolved': ProblemFilter.Resolved }
                  ]
               }"
               @click="onFilterClick"
            />
         </div>

         <list
            :headers="[
               {'name': 'Name'},
               {'author': 'Author'},
               {'date': 'Date'},
            ]"
            :items="filtered"
            :formatData="formatItem"
            :isCanAdd="isTeacher"
            @chooseItem="chooseProblem"
         />

      </Section>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {FullProblem, PartialProblem} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, Button, ButtonGroup, List, Tags, Section} from '@/components';
   import {ROUTES} from '@/router'
   import {RootState} from "@/store/state";
   import {ProblemFilter} from "@/store/modules";
   import {Tag} from "@/models/problems";

   @Component({
      components: {
         PageHeader,
         Button,
         ButtonGroup,
         List,
         Tags,
         Section
      }
   })
   export default class ProblemsList extends Vue {

      @Getter filteredProblems: Array<FullProblem | PartialProblem>;
      @Getter isTeacher: boolean;
      @Getter allTags: Array<Tag>;

      @Action(actions.READ_PROBLEMS_LIST) readProblems: () => void
      @Action(actions.READ_TAGS) readTags: () => void
      @Action(actions.TOGGLE_FILER_TAG) toggleFilterTag: (tag: Tag) => void

      @Action(actions.SET_PROBLEMS_FILTER) setProblemsFilter: (filter: ProblemFilter) => void

      @State((state: RootState) => state.problems.filter)
      filter: ProblemFilter

      @State((state: RootState) => state.problems.filterTags)
      activeTags: Array<Tag>

      ProblemFilter = ProblemFilter

      get filtered() {
         return this.filteredProblems
      }

      onFilterClick(value: ProblemFilter) {
         this.setProblemsFilter(value)
      }

      formatItem(item: FullProblem) {
         return {
            ...item,
            date: item.updatedAt ? item.updatedAt : item.createdAt,
            author: item.author.login
         }
      }

      created() {
         this.readProblems()
         this.readTags()
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

      chooseTag(tag: Tag) {
         this.toggleFilterTag(tag)
      }

   }
</script>

<style lang="scss" scoped>
   @import "../../styles/config";

   .problems {
      width: 100%;

      &--tags {
         width: 100%;
         height: 3rem;
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


   }
</style>
