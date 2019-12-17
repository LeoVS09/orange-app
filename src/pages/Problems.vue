<template>
   <div class="problems">
      <PageHeader>
         <template #text>{{'Problems' | translate}}</template>
         <template #actions>
            <Action v-if="isTeacher" icon="add" @click="add">{{'Add problem' | translate}}</Action>
         </template>
      </PageHeader>

      <!-- <ProblemsList
         :problems="list.nodes"
         :tags="allTags"
         :loadProblems="loadItems"
         :loadTags="loadTags"
         :isTeacher="isTeacher"
         @add="add"
         @choose-item="chooseItem"
      /> -->

      <Section>
         <list
            :items="list.nodes"
            :isCanAdd="isTeacher"
            inlineAdd
            @add="add"
            @choose-item="chooseItem"
            :key="reactive"
         >
            <list-column>name</list-column>
            <list-column>difficulty</list-column>
            
            <list-column name="updatedAt">updated</list-column>
         </list>
      </Section>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { FullProblem, PartialProblem } from '@/models'
import * as actions from '@/store/actionTypes'
import { PageHeaderAction, Section } from '@/components'
import { ROUTES } from '@/router'
import { Tag, ProblemRepository } from '@/models/problems'
import { RouterPush } from '@/components/decorators'
import ProblemsList from '@/containers/ProblemsList.vue'
import { List, ListColumn, PageHeader } from '@/containers'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'
import { ListProducer } from '@/lazyDB/database/types'

const { MODULES, actionName } = actions

// TODO: add author
// TODO: make difficulty like in Problems list

@Component({
  components: {
    PageHeader,
    ProblemsList,
    Action: PageHeaderAction,
    List,
    ListColumn,
    Section
  },
})
export default class Problems extends Mixins(ReactiveUpdate) {

   get list(): ListProducer<PartialProblem> {
      const list =  ProblemRepository.list(reactiveUpdate(this)) as ListProducer<PartialProblem> 
      console.log('Problems list:', list)
      return list
   }

   @Getter public isTeacher!: boolean;

   @Getter public allTags!: Tag[];

   @Action(actionName(MODULES.PROBLEMS, actions.READ_LIST))
   public loadItems!: () => void;

   @Action(actionName(MODULES.TAGS, actions.READ_LIST)) public loadTags!: () => void;

   @RouterPush(ROUTES.CREATE_PROBLEM)
   public add!: () => void;

   @RouterPush(ROUTES.PROBLEM)
   public chooseItem!: (item: PartialProblem) => void;
}
</script>
