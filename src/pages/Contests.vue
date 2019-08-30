<template>
   <div class="problems">
      <PageHeader>
         <template #text>{{'Contests' | translate}}</template>
         <template #actions>
            <Action v-if="isTeacher" icon="add" @click="add">{{'Add contest' | translate}}</Action>
         </template>
      </PageHeader>

      <Section>
         <list
            :items="items"
            :formatData="formatItem"
            :isCanAdd="isTeacher"
            @add="add"
            @choose-item="chooseItem"
            :load="loadItems"
         >
            <list-column>name</list-column>
            <list-column>author</list-column>
            <list-column name="updatedAt">updated</list-column>
            <template #add>{{'Add' | translate}}</template>
            <template #previous>{{'Previous' | translate}}</template>
            <template #next>{{'Next' | translate}}</template>
         </list>
      </Section>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { PartialContest } from '@/models'
import * as actions from '@/store/actionTypes'
import {
  Button,
  Tags,
  Section,
  PageHeaderAction,
  Filters,
} from '@/components'
import { ROUTES } from '@/router'
import { ProblemFilter } from '@/store/modules'
import { Tag } from '@/models/problems'
import { FullContest } from '@/models/contest'
import { RouterPush } from '@/components/decorators'
import {
  List,
  ListColumn,
  PageHeader,
  Breadcrumb,
} from '@/containers'

const { MODULES, actionName } = actions

@Component({
  components: {
    PageHeader,
    Breadcrumb,
    Button,
    Filters,
    List,
    ListColumn,
    Tags,
    Section,
    Action: PageHeaderAction,
  },
})
export default class Contests extends Vue {
   @Getter('contests') public items!: Array<PartialContest | FullContest>;

   @Getter public isTeacher!: boolean;

   @Getter public allTags!: Tag[];

   @Action(actionName(MODULES.CONTESTS, actions.READ_LIST))
   public loadItems!: () => void;

   public ProblemFilter = ProblemFilter;

   @RouterPush(ROUTES.CREATE_CONTEST)
   public add!: () => void;

   @RouterPush(ROUTES.CONTEST)
   public chooseItem!: (item: PartialContest) => void;

   public formatItem(item: PartialContest) {
     return {
       ...item,
       date: item.updatedAt ? item.updatedAt : item.createdAt,
       author: item.creator.login,
     }
   }
}
</script>
