<template>
   <div class="country">
      <PageHeader
         :createdAt="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
         :is-loading="false"
         :editable="isTeacher"
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
            @add="add"
            @choose-item="chooseItem"
            :key="reactive"
         >
            <list-column name="name">city</list-column>
            <list-column name="updatedAt">updated</list-column>
         </list>
      </Section>

      <FloatingButton
         :visible="model | isChanged"
         @click="onSave"
         :disabled="model | isPending"
         :primary="true"
         :circle="true"
         :shadow="true"
         :gradientHighlight="false"
         icon="autorenew"
      >{{'save' | translate | capitalise}}</FloatingButton>

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
  DataView,
  FloatingButton
} from '@/components'
import { ROUTES } from '@/router/routes'
import { City } from '@/models'
import { CountryRepository } from '@/db'
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
    ListColumn,
    FloatingButton
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
    return cities
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

   public onSave() {
     // TODO
     console.log('save')
   }
}
</script>
