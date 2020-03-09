<template>
   <div class="country">
      <PageHeader
         :createdAt="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
         :is-loading="model | isReading('name')"
      >
         <template #breadcrumbs>
            <breadcrumb :to="{name: ROUTES.COUNTRIES}">{{'Countries' | translate}}</breadcrumb>
         </template>
      </PageHeader>

      <LazyData
         v-model="model"
         :editable="isTeacher"
      >
         <LazyProperty>code</LazyProperty>
      </LazyData>

      <Section>
         <list
            :items="cities"
            :isCanAdd="isTeacher"
            inlineAdd
            :validateAdd="validate"
            @add="add"
            @choose-item="chooseItem"
         >
            <list-column>name</list-column>
            <list-column name="updatedAt">updated</list-column>
         </list>
      </Section>
   </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import Vue from 'vue'
import {
  Button,
  Tags,
  Section,
  TextSection,
  PageHeaderAction,
  Filters,
  DataView
} from '@/components'
import { ROUTES } from '@/router'
import { City, CountryRepository } from '@/models/country'
import { RouterPush } from '@/components/decorators'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'

import {
  List,
  ListColumn,
  LazyProperty,
  LazyData,
  PageHeader,
  Breadcrumb
} from '@/containers'

@Component({
  components: {
    PageHeader,
    Breadcrumb,
    Button,
    Filters,
    List,
    Tags,
    Section,
    TextSection,
    Action: PageHeaderAction,
    DataView,
    LazyData,
    LazyProperty,
    ListColumn
  }
})
export default class CountryView extends Mixins(ReactiveUpdate) {
  get model() {
    const country = CountryRepository.findOne(this.id, reactiveUpdate(this))
    console.log('Country', country)
    return country
    // return CountryRepository.findOne(this.id, reactiveUpdate(this))
  }

  get cities(): Array<City> {
    const cities = this.model.cities!.nodes
    console.log('Country cities', cities)
    // TODO: temporal hack, need investigate why vue not rerender without map
    return cities.map((node) => node)
  }

   @Prop({
     type: String,
     required: true
   })
   public id!: string;

   @Getter public isTeacher!: boolean;

   public ROUTES = ROUTES;

   @RouterPush(ROUTES.CITY)
   public chooseItem!: (city: City) => void;

   public add() {
     // TODO
   }

   public validate() {
     // TODO
   }
}
</script>
