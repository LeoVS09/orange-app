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
import { FullProblem, PartialProblem } from '@/models'
import * as actions from '@/store/actionTypes'
import { PageHeaderAction, Section } from '@/components'
import { ROUTES } from '@/router'
import {
  Tag,
  ProblemRepository,
  Problem,
  TagRepository
} from '@/models/problems'
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
  }
})
export default class Problems extends Mixins(ReactiveUpdate) {

  reactiveUpdateOptions = {
    debounce: 100
  }

  get list(): ListProducer<Problem> {
    const list = ProblemRepository.list(reactiveUpdate(this)) as ListProducer<Problem>
    // const list: ListProducer<Problem> = {
    //   totalCount: 0,
    //   onPage: 10,
    //   pageNumber: 10,
    //   maxPageNumber: 10,
    //   nodes: [{
    //     id: 'some-id',
    //     difficulty: 10,
    //     name: 'problem-name',
    //     author: { user: { name: 'some-author' } },
    //     updatedAt: new Date(),
    //     createdAt: new Date()
    //   } as unknown as Problem]
    // }
    console.log('Problems list:', list)
    return list
  }

  get tags(): ListProducer<Tag> {
    return TagRepository.list(reactiveUpdate(this)) as ListProducer<Tag>
    // const list: ListProducer<Tag> = {
    //   totalCount: 0,
    //   onPage: 10,
    //   pageNumber: 10,
    //   maxPageNumber: 10,
    //   nodes: [{
    //     id: 'some-id',
    //     name: 'problem-name',
    //     updatedAt: new Date(),
    //     createdAt: new Date()
    //   }]
    // }
    // return list
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
