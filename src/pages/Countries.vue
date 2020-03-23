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
            :key="reactive"
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
import { Component, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import {
  Button,
  Tags,
  Section,
  PageHeaderAction,
  Filters
} from '@/components'
import { ROUTES } from '@/router/routes'
import { RouterPush } from '@/components/decorators'
import { Country, CountryRepository } from '@/models/country'
import { List, ListColumn, PageHeader } from '@/containers'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'
import { ListProducer } from '@/lazyDB/database/types'

@Component({
  components: {
    PageHeader,
    Button,
    Filters,
    List,
    ListColumn,
    Tags,
    Section,
    Action: PageHeaderAction
  }
})
export default class Countries extends Mixins(ReactiveUpdate) {
   @Getter
   public isTeacher!: boolean;

   reactiveUpdateOptions = {
     debounce: 100
   }

   @RouterPush(ROUTES.COUNTRY)
   public chooseItem!: (country: Country) => void;

   get list(): ListProducer<Country> {
     const list = CountryRepository.list(reactiveUpdate(this)) as ListProducer<Country>
     console.log('Countries list:', list)
     return list
   }

   public add() {
     // TODO
   }

   public validate() {
     // TODO
   }

   public formatItem(item: Country) {
     return {
       name: item.name,
       code: item.code,
       updated: item.updatedAt
     }
   }
}
</script>
