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
            :headers="[
               {'name': $t('Name')},
               {'difficulty': $t('Difficulty')},
               {'author': $t('Author')},
               {'date': $t('Updated')},
            ]"
            :items="filteredProblems"
            :formatData="formatItem"
            :isCanAdd="isTeacher"
            @add="add"
            @choose-item="chooseItem"
            :load="loadProblems"
         >
            <template #add>{{'Add' | translate}}</template>
            <template #previous>{{'Previous' | translate}}</template>
            <template #next>{{'Next' | translate}}</template>
         </list>
      </Section>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import {Button, List, Tags, Section, Filters} from '@/components';
   import {FullProblem, PartialProblem, Tag} from "../models";
   import {ProblemFilter} from "../store/modules/problems";

   function filterProblemsByPublication(filter: ProblemFilter, data: Array<PartialProblem | FullProblem>) {
      const now = new Date()

      if (filter === ProblemFilter.All)
         return data

      if (filter === ProblemFilter.Public)
         return data.filter(p => p.publicationDate && p.publicationDate <= now)

      if (filter === ProblemFilter.NotPublic)
         return data.filter(p => !p.publicationDate || p.publicationDate > now)

      return data
   }

   function filterProblemsByTags(tags: Array<Tag>, data: Array<PartialProblem | FullProblem>) {
      if(!tags.length)
         return data

      return data.filter(p =>
         tags.every(tag =>
            p.tags.some(({id}) => tag.id === id)
         )
      )
   }

   @Component({
      components: {
         Button,
         Filters,
         List,
         Tags,
         Section,
      }
   })
   export default class ProblemsList extends Vue {

      @Prop(Array) problems: Array<PartialProblem | FullProblem>

      @Prop(Array) tags: Array<Tag>

      @Prop(Boolean) isTeacher: boolean

      @Prop(Function) loadProblems: () => void
      @Prop(Function) loadTags: () => void

      activeFilter: ProblemFilter = ProblemFilter.All

      ProblemFilter = ProblemFilter

      activeTags: Array<Tag> = []

      get filteredProblems(){
         if(!this.problems || !this.problems.length)
            return []

         const publicated = filterProblemsByPublication(this.activeFilter, this.problems)

         return filterProblemsByTags(this.activeTags, publicated)
      }

      @Emit('add')
      add(value: any){
         return value
      }

      @Emit('choose-item')
      chooseItem(value: PartialProblem | FullProblem): PartialProblem | FullProblem{
         return value
      }

      @Emit('set-filter')
      setFilter(filter: ProblemFilter): ProblemFilter {
         return this.activeFilter = filter
      }

      @Emit('set-filter-tags')
      toggleFilterTag(tag: Tag): Array<Tag>{
         const index = this.activeTags.findIndex(item => item.id === tag.id)
         if(index === -1) {
            this.activeTags.push(tag)
            return this.activeTags
         }

         this.activeTags = [...this.activeTags.slice(0, index), ...this.activeTags.slice(index+1)]

         return this.activeTags
      }

      formatItem(item: PartialProblem) {
         return {
            ...item,
            date: item.updatedAt ? item.updatedAt : item.createdAt,
            author: item.author.login
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
