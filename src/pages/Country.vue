<template>
   <div class="country">
      <PageHeader
         :breadcrumbs="[{[$t('Countries')]: {name: ROUTES.COUNTRIES}}]"
         :created="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
         :is-loading="model | isReading('name')"
      />

      <LazyData
         v-model="model"
         :editable="isTeacher"
      >
         <LazyProperty>code</LazyProperty>
      </LazyData>

      <Section>
         <list
            :headers="[
               {'name': $t('Name')},
               {'updatedAt': $t('Updated')}
            ]"
            :items="model.cities.nodes"
            :isCanAdd="isTeacher"
            inlineAdd
            :validateAdd="validate"
            @add="add"
            @choose-item="chooseItem"
         />
      </Section>
   </div>
</template>

<script lang="ts">
import {Component, Prop, Mixins} from 'vue-property-decorator';
import {Getter, Action, State} from 'vuex-class';
import {Country} from '@/models';
import * as actions from '@/store/actionTypes';
import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
import {ROUTES} from '@/router';
import ModelById from '@/components/mixins/ModelById';
import {City} from '@/models/country';
import {RouterPush} from '@/components/decorators';
import {actionName, MODULES} from '@/store/actionTypes';
import Vue from 'vue';
import {CountryModel} from '@/models/country';
import LazyData from '@/containers/LazyData.vue';
import LazyProperty from '@/containers/LazyProperty.vue';

@Component({
   components: {
      PageHeader,
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
   },
})
export default class CountryView extends Vue {

   get model() {
      return CountryModel.findOne(this.id, () => this.$forceUpdate());
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
