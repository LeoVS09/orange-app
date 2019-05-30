<template>
   <div class="problems">
      <PageHeader>
         <template #text>{{'Problems' | translate}}</template>
         <template #actions>
            <Action v-if="isTeacher" icon="add" @click="add">{{'Add problem' | translate}}</Action>
         </template>
      </PageHeader>

      <ProblemsList
         :problems="items"
         :tags="allTags"
         :loadProblems="loadItems"
         :loadTags="loadTags"
         :isTeacher="isTeacher"
         @add="add"
         @choose-item="chooseItem"
      />
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {FullProblem, PartialProblem} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, PageHeaderAction} from '@/components';
   import {ROUTES} from '@/router'
   import {Tag} from "@/models/problems";
   import {MODULES, actionName} from "@/store/actionTypes";
   import {RouterPush} from "@/components/decorators";
   import ProblemsList from '@/containers/ProblemsList.vue'

   @Component({
      components: {
         PageHeader,
         ProblemsList,
         Action: PageHeaderAction
      }
   })
   export default class Problems extends Vue {

      @Getter('problems') items: Array<FullProblem | PartialProblem>;
      @Getter isTeacher: boolean;
      @Getter allTags: Array<Tag>;

      @Action(actionName(MODULES.PROBLEMS, actions.READ_LIST))
      loadItems: () => void

      @Action(actionName(MODULES.TAGS, actions.READ_LIST)) loadTags: () => void


      @RouterPush(ROUTES.CREATE_PROBLEM)
      add: () => void

      @RouterPush(ROUTES.PROBLEM)
      chooseItem: (item: PartialProblem) => void

   }
</script>
