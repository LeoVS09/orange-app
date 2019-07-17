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
import {Component, Prop, Mixins} from 'vue-property-decorator';
import {Getter, Action, State} from 'vuex-class';
import {Country, PartialProblem, Tag} from '@/models';
import * as actions from '@/store/actionTypes';
import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
import {ROUTES} from '@/router';
import ModelById from '@/components/mixins/ModelById';
import {RouterPush} from '@/components/decorators';
import {actionName, MODULES} from '@/store/actionTypes';
import {FullContest} from '@/models/contest';
import ProblemsList from '@/containers/ProblemsList.vue';

@Component({
   components: {
      PageHeader,
      Button,
      ProblemsList,
      Action: PageHeaderAction,
      DataView,
      ModelInfo,
   },
})
export default class ContestView extends Mixins(ModelById) {


   get items() {
      if (!this.model) {
         return [];
      }

      return (this.model as FullContest).problems || [];
   }

   @Getter('contestById') public modelById!: (id: string) => FullContest;

   @Getter public isTeacher!: boolean;
   @Getter public allTags!: Tag[];

   @Action(actionName(MODULES.CONTESTS, actions.READ)) public loadModel!: (id: string) => Promise<boolean>;
   @Action(actionName(MODULES.TAGS, actions.READ_LIST)) public loadTags!: () => void;

   public ROUTES = ROUTES;

   @RouterPush(ROUTES.PROBLEM)
   public chooseItem!: (problem: PartialProblem) => void;

   public add() {
      // TODO
   }

   public validate() {
      // TODO
   }

}
</script>
