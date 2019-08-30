<template>
   <div class="country">
      <PageHeader
         :createdAt="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.name"
      >
         <temaplte #breadcrumbs>
            <breadcrumb :to="{name: ROUTES.CONTESTS}">{{'Contests' | translate}}</breadcrumb>
         </temaplte>
      </PageHeader>

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
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { PartialProblem, Tag } from '@/models'
import * as actions from '@/store/actionTypes'
import {
  Button,
  ModelInfo,
  PageHeaderAction,
  DataView,
} from '@/components'
import { ROUTES } from '@/router'
import ModelById from '@/components/mixins/ModelById'
import { RouterPush } from '@/components/decorators'
import { FullContest } from '@/models/contest'
import ProblemsList from '@/containers/ProblemsList.vue'
import { PageHeader, Breadcrumb } from '@/containers'

const { actionName, MODULES } = actions

@Component({
  components: {
    PageHeader,
    Breadcrumb,
    Button,
    ProblemsList,
    Action: PageHeaderAction,
    DataView,
    ModelInfo,
  },
})
export default class ContestView extends Mixins(ModelById) {
  get items() {
    if (!this.model)
      return []

    return (this.model as FullContest).problems || []
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
