<template>
   <div class="problems">
      <PageHeader>
         <template #text>{{'Problems' | translate}}</template>
         <template #actions>
            <Action v-if="isTeacher" icon="add" @click="add">Add problem</Action>
         </template>
      </PageHeader>

      <Tags
         :values="allTags"
         @choose="toggleFilterTag"
         :activeTags="filterTags"
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
   import {MODULES, actionName} from "@/store/actionTypes";

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

      @Action(actionName(MODULES.PROBLEMS, actions.READ_LIST))
      loadItems: () => void

      @Action(actionName(MODULES.TAGS, actions.READ_LIST)) loadTags: () => void

      @Action(actionName(MODULES.TAGS, actions.TOGGLE_FILER_TAG))
      toggleFilterTag: (tag: Tag) => void

      @Action(actionName(MODULES.PROBLEMS, actions.SET_PROBLEMS_FILTER))
      setFilter: (filter: ProblemFilter) => void

      @Getter
      activeFilter: ProblemFilter

      @Getter
      filterTags: Array<Tag>

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
