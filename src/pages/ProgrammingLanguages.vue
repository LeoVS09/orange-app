<template>
   <div class="countries">
      <PageHeader>
         <template #text>{{'Programming languages' | translate}}</template>
      </PageHeader>

      <Section>
         <list
            :items="list.nodes"
            :isCanAdd="isTeacher"
            inlineAdd
            :validateAdd="validate"
            @add="add"
            @choose-item="chooseItem"
         >
            <list-column>name</list-column>
            <list-column>alias</list-column>
            <list-column>version</list-column>
            <list-column name="updatedAt">updated</list-column>
         </list>
      </Section>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Country } from '@/models'
import {
  Button,
  Tags,
  Section,
  PageHeaderAction,
  Filters,
} from '@/components'
import { ROUTES } from '@/router'
import { RouterPush } from '@/components/decorators'
import { ProgrammingLanguageRepository } from '@/models/programmingLanguage'
import { List, ListColumn, PageHeader } from '@/containers'

@Component({
  components: {
    PageHeader,
    Button,
    Filters,
    List,
    Tags,
    Section,
    Action: PageHeaderAction,
    ListColumn,
  },
})
export default class ProgrammingLanguages extends Vue {
   @Getter public isTeacher!: boolean;

   @RouterPush(ROUTES.PROGRAMMING_LANGUAGE)
   public chooseItem!: (country: Country) => void;

   public data() {
     return {
       list: ProgrammingLanguageRepository.list(),
     }
   }

   public add() {
     // TODO
   }

   public validate() {
     // TODO
   }
}
</script>
