<template>
   <div class="country">
      <PageHeader
         :breadcrumbs="[{[$t('Contests')]: {name: ROUTES.CONTESTS}}]"
         :created="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.name"
      />

      <ModelInfo
         v-if="model"
         v-model="model"
         :exclude="['creatorId']"
      />

      <ProblemsList
         :problems="items"
         :tags="allTags"
         :loadTags="loadTags"
         :isTeacher="isTeacher"
         @add="add"
         @choose-item="chooseItem"
      />
   </div>
</template>

<script lang="ts">
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {Country, PartialProblem, Tag} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
   import {ROUTES} from '@/router'
   import ModelById from "@/components/mixins/ModelById";
   import {RouterPush} from "@/components/decorators";
   import {actionName, MODULES} from '@/store/actionTypes';
   import {FullContest} from "@/models/contest";
   import ProblemsList from '@/containers/ProblemsList.vue'

   @Component({
      components: {
         PageHeader,
         Button,
         ProblemsList,
         Action: PageHeaderAction,
         DataView,
         ModelInfo
      }
   })
   export default class ContestView extends Mixins(ModelById) {

      @Getter('contestById') modelById: (id: string) => FullContest;

      @Getter isTeacher: boolean;
      @Getter allTags: Array<Tag>;

      @Action(actionName(MODULES.CONTESTS, actions.READ)) loadModel: (id: string) => Promise<boolean>
      @Action(actionName(MODULES.TAGS, actions.READ_LIST)) loadTags: () => void

      ROUTES = ROUTES

      add() {
         // TODO
      }

      validate(){
         // TODO
      }


      get items() {
         if (!this.model)
            return []

         return (this.model as FullContest).problems || []
      }

      @RouterPush(ROUTES.PROBLEM)
      chooseItem: (problem: PartialProblem) => void

   }
</script>
