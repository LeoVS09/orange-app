<template>
   <div class="problems">
      <PageHeader>
         <template #text>Problems</template>
         <template #actions>
            <Action v-if="isTeacher" icon="add" @click="add">Add problem</Action>
         </template>
      </PageHeader>

      <Tags
         :values="allTags"
         @choose="toggleFilterTag"
         :activeTags="activeTags"
         :load="loadTags"
      />

      <Section>
         <Filters
            :active="activeFilter"
            :buttons="[
                  { 'All': ProblemFilter.All },
                  { 'Public': ProblemFilter.Public },
                  { 'Not public': ProblemFilter.NotPublic },
                  { 'Resolved': ProblemFilter.Resolved }
               ]"
            @click="setFilter"
         />
         <list
            :headers="[
               {'name': 'Name'},
               {'author': 'Author'},
               {'date': 'Date'},
            ]"
            :items="items"
            :formatData="formatItem"
            :isCanAdd="isTeacher"
            @add="add"
            @choose-item="chooseItem"
            :load="loadItems"
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
   import {PageHeader, Button, List, Tags, Section, PageHeaderAction, Filters} from '@/components';
   import {ROUTES} from '@/router'
   import {RootState} from "@/store/state";
   import {ProblemFilter} from "@/store/modules";
   import {Tag} from "@/models/problems";

   @Component({
      components: {
         PageHeader,
         Button,
         Filters,
         List,
         Tags,
         Section,
         Action: PageHeaderAction
      }
   })
   export default class ProblemsList extends Vue {

      @Getter('filteredProblems') items: Array<FullProblem | PartialProblem>;
      @Getter isTeacher: boolean;
      @Getter allTags: Array<Tag>;

      @Action(actions.READ_PROBLEMS_LIST) loadItems: () => void
      @Action(actions.READ_TAGS) loadTags: () => void
      @Action(actions.TOGGLE_FILER_TAG) toggleFilterTag: (tag: Tag) => void

      @Action(actions.SET_PROBLEMS_FILTER) setFilter: (filter: ProblemFilter) => void

      @State((state: RootState) => state.problems.filter)
      activeFilter: ProblemFilter

      @State((state: RootState) => state.problems.filterTags)
      activeTags: Array<Tag>

      ProblemFilter = ProblemFilter

      formatItem(item: FullProblem) {
         return {
            ...item,
            date: item.updatedAt ? item.updatedAt : item.createdAt,
            author: item.author.login
         }
      }

      add() {
         this.$router.push({name: ROUTES.CREATE_PROBLEM});
      }

      chooseItem(problem: FullProblem) {
         this.$router.push({
            name: ROUTES.PROBLEM,
            params: {
               id: problem.id
            }
         })
      }

   }
</script>
