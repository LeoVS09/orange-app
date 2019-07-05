<template>
   <div class="city">
      <PageHeader
         :breadcrumbs="[
            {[$t('Countries')]: {name: ROUTES.COUNTRIES}},
            { [parent && parent.name || $t('Country')]: {
               name: ROUTES.COUNTRY,
               params: {id: model && model.countryId}
            }}
         ]"
         :created="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.name"
      />

      <Section>
         <list
            :headers="[
               {'longName': $t('Name')},
               {'shortName': $t('Short')},
               {'updatedAt': $t('Updated')}
            ]"
            :items="model.universities.nodes"
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
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {City, Country, University} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, List, ModelInfo, Section, PageHeaderAction} from '@/components';
   import {ROUTES} from '@/router'
   import ModelById from "@/components/mixins/ModelById";
   import {RouterPush} from "@/components/decorators";
   import {actionName, MODULES} from '@/store/actionTypes';
   import {CountryModel, CityModel} from '@/models/country'
   import Vue from 'vue'
   import ReactiveUpdate, {reactiveUpdate} from "@/components/mixins/ReactiveUpdate";

   @Component({
      components: {
         PageHeader,
         List,
         Section,
         Action: PageHeaderAction,
         ModelInfo
      }
   })
   export default class CityView extends Mixins(ReactiveUpdate) {

      @Prop({
         type: String,
         required: true
      })
      id: string

      get model(){
         return CityModel.findOne(this.id, reactiveUpdate(this))
      }

      get parent(){
         return this.model && this.model.country
      }

      @Getter isTeacher: boolean;

      ROUTES = ROUTES

      add() {
         // TODO
      }

      validate(){
         // TODO
      }

      @RouterPush(ROUTES.UNIVERSITY)
      chooseItem: (university: University) => void

   }
</script>
