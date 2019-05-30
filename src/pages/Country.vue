<template>
   <div class="country">
      <PageHeader
         :breadcrumbs="[{'Countries': {name: ROUTES.COUNTRIES}}]"
         :created="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.name"
      />

      <ModelInfo
         v-if="model"
         v-model="model"
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
   import {Component, Prop, Mixins} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {Country} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
   import {ROUTES} from '@/router'
   import ModelById from "@/components/mixins/ModelById";
   import {City} from "@/models/country";
   import {RouterPush} from "@/components/decorators";
   import {actionName, MODULES} from '@/store/actionTypes';

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

      @Action(actionName(MODULES.COUNTRIES, actions.READ)) loadModel: (id: string) => Promise<boolean>

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

      @RouterPush(ROUTES.CITY)
      chooseItem: (city: City) => void

   }
</script>
