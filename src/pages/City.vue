<template>
   <div class="city">
      <PageHeader
         :createdAt="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
         :is-loading="false"
      >
         <template #breadcrumbs>
            <breadcrumb :to="{name: ROUTES.COUNTRIES}">{{'Countries' | translate}}</breadcrumb>
            <breadcrumb :to="{
               name: ROUTES.COUNTRY,
               params: {id: model.countryId}
            }">{{model.country.name || $t('Country')}}</breadcrumb>
         </template>
      </PageHeader>

      <Section>
         <list
            :items="model.universities.nodes"
            :isCanAdd="isTeacher"
            inlineAdd
            :validateAdd="validate"
            @add="add"
            @choose-item="chooseItem"
            :key="reactive"
         >
            <list-column name="longName">university</list-column>
            <list-column name="shortName">short</list-column>
            <list-column name="updatedAt">updated</list-column>
         </list>
      </Section>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { University } from '@/models'
import { ModelInfo, Section, PageHeaderAction } from '@/components'
import { ROUTES } from '@/router/routes'
import { RouterPush } from '@/components/decorators'
import { CityRepository } from '@/db'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'
import {
  List,
  ListColumn,
  PageHeader,
  Breadcrumb
} from '@/containers'

@Component({
  components: {
    PageHeader,
    List,
    ListColumn,
    Section,
    Action: PageHeaderAction,
    ModelInfo,
    Breadcrumb
  }
})
export default class CityView extends Mixins(ReactiveUpdate) {
  get model() {
    return CityRepository.findOne(this.id, reactiveUpdate(this))
  }

   @Prop({
     type: String,
     required: true
   })
   public id!: string;

   @Getter public isTeacher!: boolean;

   public ROUTES = ROUTES;

   @RouterPush(ROUTES.UNIVERSITY)
   public chooseItem!: (university: University) => void;

   public add() {
     // TODO
   }

   public validate() {
     // TODO
   }
}
</script>
