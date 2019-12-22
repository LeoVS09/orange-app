<template>
   <div class="problems-list">
      <Tags
         :values="tags"
         @choose="toggleFilterTag"
         :activeTags="activeTags"
         :load="loadTags"
      />

      <Section>
         <Filters
            :active="activeFilter"
            :buttons="[
                  { [$t('All')]: ProblemFilter.All },
                  { [$t('Public')]: ProblemFilter.Public },
                  { [$t('Not public')]: ProblemFilter.NotPublic },
                  { [$t('Resolved')]: ProblemFilter.Resolved }
               ]"
            @click="setFilter"
         />
         <list
            :items="filteredProblems"
            :formatData="formatItem"
            :isCanAdd="isTeacher"
            @add="add"
            @choose-item="chooseItem"
            :load="loadProblems"
         >
            <list-column>name</list-column>
            <list-column>difficulty</list-column>
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
import { Component, Prop, Emit } from 'vue-property-decorator'
import {
  Button, Tags, Section, Filters,
} from '@/components'
import { FullProblem, PartialProblem, Tag } from '../models'
import { ProblemFilter } from '../store/modules/problems'
import List from './List.vue'
import ListColumn from './ListColumn.vue'

const isProblemPublicated = ({ publicationDate: date }: PartialProblem, now = new Date()): boolean =>
  !!date && date <= now

function filterProblemsByPublication(filter: ProblemFilter, data: Array<PartialProblem>) {
  if (filter === ProblemFilter.All)
    return data

  const now = new Date()

  if (filter === ProblemFilter.Public)
    return data.filter(p => isProblemPublicated(p, now))

  if (filter === ProblemFilter.NotPublic)
    return data.filter(p => !isProblemPublicated(p, now))

  return data
}

const isProblemContainAnyTag = ({ problemsTags }: PartialProblem, tags: Tag[]): boolean =>
  tags.every(tag => problemsTags.nodes.some(({ tag: { id } }) => tag.id === id))

function filterProblemsByTags(tags: Tag[], data: Array<PartialProblem>) {
  if (!tags.length)
    return data

  return data.filter(p => isProblemContainAnyTag(p, tags))
}

@Component({
  components: {
    Button,
    Filters,
    List,
    ListColumn,
    Tags,
    Section,
  },
})
export default class ProblemsList extends Vue {
   @Prop(Array) public problems!: Array<PartialProblem>;

   @Prop(Array) public tags!: Tag[];

   @Prop(Boolean) public isTeacher!: boolean;

   @Prop(Function) public loadProblems!: () => void;

   @Prop(Function) public loadTags!: () => void;

   public activeFilter: ProblemFilter = ProblemFilter.All;

   public ProblemFilter = ProblemFilter;

   public activeTags: Tag[] = [];

   get filteredProblems() {
     if (!this.problems || !this.problems.length)
       return []

     const publicated = filterProblemsByPublication(this.activeFilter, this.problems)

     return filterProblemsByTags(this.activeTags, publicated)
   }

   @Emit('add')
   public add(value: any) {
     return value
   }

   @Emit('choose-item')
   public chooseItem(value: PartialProblem | FullProblem): PartialProblem | FullProblem {
     return value
   }

   @Emit('set-filter')
   public setFilter(filter: ProblemFilter): ProblemFilter {
     return this.activeFilter = filter
   }

   @Emit('set-filter-tags')
   public toggleFilterTag(tag: Tag): Tag[] {
     const index = this.activeTags.findIndex(item => item.id === tag.id)
     if (index === -1) {
       this.activeTags.push(tag)
       return this.activeTags
     }

     this.activeTags = [...this.activeTags.slice(0, index), ...this.activeTags.slice(index + 1)]

     return this.activeTags
   }

   public formatItem(item: PartialProblem) {
     return {
       ...item,
       date: item.updatedAt ? item.updatedAt : item.createdAt,
       author: item.author.login,
     }
   }
}
</script>

<style lang="scss">
   .problems-list {
      width: 100%;
      height: 100%;
   }
</style>
