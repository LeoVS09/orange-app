<template>
   <div class="problems">
      <PageHeader>
         <template #text>{{'Problems' | translate}}</template>
         <template #actions>
            <Action v-if="isTeacher" icon="add" @click="add">{{'Add problem' | translate}}</Action>
         </template>
      </PageHeader>

      <ProblemsList
         :problems="list.nodes"
         :tags="tags.nodes"
         :isTeacher="isTeacher"
         @add="add"
         @choose-item="chooseItem"
         :key="reactive"
      />

   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Mixins } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import {
  FullProblem,
  PartialProblem,
  Tag,
  Problem
} from '@/models'
import { MODULES, actionName } from '@/store/actionTypes'
import { PageHeaderAction, Section } from '@/components'
import { ROUTES } from '@/router'
import { RouterPush } from '@/components/decorators'
import ProblemsList from '@/containers/ProblemsList.vue'
import { List, ListColumn, PageHeader } from '@/containers'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'
import { ListProducer } from '@/lazyDB/database/types'
import { ProblemRepository, TagRepository } from '@/db'

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
  }
})
export default class Problems extends Mixins(ReactiveUpdate) {

  reactiveUpdateOptions = {
    debounce: 100
  }

  get list(): ListProducer<Problem> {
    return ProblemRepository.list(reactiveUpdate(this))
  }

  get tags(): ListProducer<Tag> {
    return TagRepository.list(reactiveUpdate(this))
  }

   @Getter public isTeacher!: boolean;

   // @Action(actionName(MODULES.PROBLEMS, actions.READ_LIST))
   public loadItems = () => console.log('try load items')

   // @Action(actionName(MODULES.TAGS, actions.READ_LIST))
   public loadTags = () => console.log('try load tags')

   @RouterPush(ROUTES.CREATE_PROBLEM)
   public add!: () => void;

   @RouterPush(ROUTES.PROBLEM)
   public chooseItem!: (item: PartialProblem) => void;
}
</script>
