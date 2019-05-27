<template>
   <div class="country">
      <PageHeader
         :breadcrumbs="[{'Countries': {name: ROUTES.COUNTRIES}}]"
      >
         <template #text>{{model && model.name}}</template>
      </PageHeader>

      <ModelInfo
         v-if="model"
         :model="model"
      />

      <Section>
         <list
            :headers="[
               {'name': 'Name'},
               {'updatedAt': 'Date'}
            ]"
            :items="items"
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
   import Vue from 'vue'
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {Country, FullProblem, PartialProblem} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
   import {ROUTES} from '@/router'
   import Loadable from "@/components/mixins/loadable";
   import ModelById from "@/components/mixins/ModelById";
   import {City} from "@/models/country";

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
         ModelInfo
      }
   })
   export default class CountryView extends Mixins(ModelById) {

      @Getter('countryById') modelById: (id: string) => Country;

      @Getter isTeacher: boolean;

      @Action(actions.LOAD_COUNTRY) loadModel: (id: string) => Promise<boolean>

      ROUTES = ROUTES

      add() {
         // TODO
      }

      validate(){
         // TODO
      }


      get items() {
         if (!this.model)
            return []

         return this.model.cities || []
      }

      chooseItem({id}: City) {
         this.$router.push({
            name: ROUTES.CITY,
            params: {id}
         })
      }

   }
</script>
