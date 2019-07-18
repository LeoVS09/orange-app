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
            :items="model.cities.nodes"
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
import {Component, Prop, Mixins} from 'vue-property-decorator';
import {Getter, Action, State} from 'vuex-class';
import {Country} from '@/models';
import * as actions from '@/store/actionTypes';
import {Button, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
import {ROUTES} from '@/router';
import ModelById from '@/components/mixins/ModelById';
import {City} from '@/models/country';
import {RouterPush} from '@/components/decorators';
import {actionName, MODULES} from '@/store/actionTypes';
import Vue from 'vue';
import {CountryRepository} from '@/models/country';
import {List, ListColumn, LazyProperty, LazyData, PageHeader, Breadcrumb} from '@/containers'

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
   },
})
export default class CountryView extends Vue {

   get model() {
      return CountryRepository.findOne(this.id, () => this.$forceUpdate());
   }

   @Prop({
      type: String,
      required: true,
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
