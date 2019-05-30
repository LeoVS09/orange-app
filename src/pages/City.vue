<template>
   <div class="city">
      <PageHeader
         :breadcrumbs="[
            {[$t('Countries')]: {name: ROUTES.COUNTRIES}},
            { [parent ? parent.name : $t('Country')]: {name: ROUTES.COUNTRY, params: {id: model && model.countryId}}}
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
   import {City, Country} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, List, ModelInfo, Section, PageHeaderAction} from '@/components';
   import {ROUTES} from '@/router'
   import ModelById from "@/components/mixins/ModelById";
   import {RouterPush} from "@/components/decorators";
   import {actionName, MODULES} from '@/store/actionTypes';

   @Component({
      components: {
         PageHeader,
         List,
         Section,
         Action: PageHeaderAction,
         ModelInfo
      }
   })
   export default class CityView extends Mixins(ModelById) {

      @Getter('cityById') modelById: (id: string) => City;

      @Getter('countryById') parentById: (id: string) => Country

      @Getter isTeacher: boolean;

      @Action(actionName(MODULES.CITIES, actions.READ)) loadModel: (id: string) => Promise<boolean>

      ROUTES = ROUTES

      add() {
         // TODO
      }

      validate(){
         // TODO
      }

      get parent(){
         const model = this.model as City
         if(!model)
            return
         return this.parentById(model.countryId)
      }

      get items() {
         if (!this.model)
            return []

         return this.model.universities || []
      }

      @RouterPush(ROUTES.UNIVERSITY)
      chooseItem: (city: City) => void

   }
</script>
