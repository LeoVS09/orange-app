<template>
   <div class="city">
      <PageHeader
         :breadcrumbs="breadcrumbs"
         :created="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.shortName"
      />

      <ModelInfo
         v-if="model"
         v-model="model"
         :exclude="['shortName', 'cityId']"
      />
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

   @Component({
      components: {
         PageHeader,
         List,
         Section,
         Action: PageHeaderAction,
         ModelInfo
      }
   })
   export default class UniversityView extends Mixins(ModelById) {

      @Getter('universityById') modelById: (id: string) => University;

      @Getter countryById: (id: string) => Country

      @Getter cityById: (id: string) => City

      @Getter isTeacher: boolean;

      @Action(actionName(MODULES.UNIVERSITIES, actions.READ)) loadModel: (id: string) => Promise<boolean>

      ROUTES = ROUTES

      add() {
         // TODO
      }

      validate(){
         // TODO
      }

      get city(){
         const model = this.model as University
         if(!model)
            return

         return this.cityById(model.cityId)
      }

      get country(){
         const city = this.city
         if(!city)
            return

         return this.countryById(city.countryId)
      }

      get breadcrumbs(){
         let result: {[key: string]: any} = [
            {'Country': {name: ROUTES.COUNTRIES}},
         ]

         const country = this.country
         if(country)
            result.push({
               [country.name]: {name: ROUTES.COUNTRY, params: {id: country.id}}
            })

         const city = this.city
         if(city) {
            result.push({
               [city.name]: {name: ROUTES.CITY, params: {id: city.id}}
            })
            return result
         }
         const model = this.model as University
         if(!model)
            return result

         result.push({
            'City': {name: ROUTES.CITY, params: {id: model.cityId}}
         })

         return result
      }

      @RouterPush(ROUTES.UNIVERSITY)
      chooseItem: (university: University) => void

   }
</script>
