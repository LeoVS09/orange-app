<template>
   <div class="countries">
      <PageHeader>
         {{'Countries' | translate}}
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
            <list-column>code</list-column>
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
  Button, Tags, Section, PageHeaderAction, Filters,
} from '@/components'
import { ROUTES } from '@/router'
import { RouterPush } from '@/components/decorators'
import { CountryRepository } from '@/models/country'
import { List, ListColumn, PageHeader } from '@/containers'

@Component({
  components: {
    PageHeader,
    Button,
    Filters,
    List,
    ListColumn,
    Tags,
    Section,
    Action: PageHeaderAction,
  },
})
export default class Countries extends Vue {
   @Getter public isTeacher!: boolean;

   @RouterPush(ROUTES.COUNTRY)
   public chooseItem!: (country: Country) => void;

   public data() {
     return {
       list: CountryRepository.list(),
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
