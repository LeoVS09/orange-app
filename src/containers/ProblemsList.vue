<template>
   <div class="problems-list">
      <Tags
         :values="tags"
         @choose="toggleFilterTag"
         :activeTags="activeTags"
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
  Button, Tags, Section, Filters
} from '@/components'
import { Problem } from '@/models/problems'
import { profileInitials } from '@/models/user'
import { FullProblem, PartialProblem, Tag } from '../models'
import { ProblemFilter } from '../store/modules/problems'
import List from './List.vue'
import ListColumn from './ListColumn.vue'

const isProblemPublicated = ({ publicationDate: date }: Problem, now = new Date()): boolean =>
  !!date && date <= now

function filterProblemsByPublication(filter: ProblemFilter, data: Array<Problem>): Array<Problem> {
  if (filter === ProblemFilter.All)
    return data

  const now = new Date()

  if (filter === ProblemFilter.Public)
    return data.filter((p) => isProblemPublicated(p, now))

  if (filter === ProblemFilter.NotPublic)
    return data.filter((p) => !isProblemPublicated(p, now))

  return data
}

const isProblemContainAnyTag = ({ problemsTags }: Problem, tags: Tag[]): boolean =>
  tags.every((tag) => problemsTags.nodes.some(({ tag: { id } }) => tag.id === id))

function filterProblemsByTags(tags: Tag[], data: Array<Problem>): Array<Problem> {
  if (!tags.length)
    return data

  return data.filter((p) => isProblemContainAnyTag(p, tags))
}

const exptractAuthourName = (problem: Problem, fallback: string): string => {
  const { author } = problem
  if (!author) {
    console.error('Problem not have author')
    return fallback
  }

  const { user } = author
  if (!user)
    return fallback

  return user.name || user.username
}

@Component({
  components: {
    Button,
    Filters,
    List,
    ListColumn,
    Tags,
    Section
  }
})
export default class ProblemsList extends Vue {
   @Prop(Array) public problems!: Array<Problem>;

   @Prop(Array) public tags!: Tag[];

   @Prop(Boolean) public isTeacher!: boolean;

   @Prop(Function) public loadProblems!: () => void;

   @Prop(Function) public loadTags!: () => void;

   public activeFilter: ProblemFilter = ProblemFilter.All;

   public ProblemFilter = ProblemFilter;

   public activeTags: Tag[] = [];

   get filteredProblems() {
     const publicated = filterProblemsByPublication(this.activeFilter, this.problems)

     return filterProblemsByTags(this.activeTags, publicated)
   }

   @Emit('add')
   public add(value: any) {
     return value
   }

   @Emit('choose-item')
   public chooseItem(value: Problem): Problem {
     return value
   }

   @Emit('set-filter')
   public setFilter(filter: ProblemFilter): ProblemFilter {
     return this.activeFilter = filter
   }

   @Emit('set-filter-tags')
   public toggleFilterTag(tag: Tag): Tag[] {
     const index = this.activeTags.findIndex((item) => item.id === tag.id)
     if (index === -1) {
       this.activeTags.push(tag)
       return this.activeTags
     }

     this.activeTags = [...this.activeTags.slice(0, index), ...this.activeTags.slice(index + 1)]

     return this.activeTags
   }

   public formatItem(item: Problem) {
     return {
       name: item.name,
       difficulty: item.difficulty,
       updatedAt: item.updatedAt,
       author: exptractAuthourName(item, this.translate('Anonymous'))
     }
   }

   // Translate text if can i18n translation connected to vue
   private translate(text: string): string {
     if (this.$t)
       return this.$t(text) as unknown as string

     return text
   }
}
</script>

<style lang="scss">
   .problems-list {
      width: 100%;
      height: 100%;
   }
</style>
