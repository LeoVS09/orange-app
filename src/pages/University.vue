<template>
   <div class="university">
      <PageHeader
         :breadcrumbs="[
            {[$t('Countries')]: {name: ROUTES.COUNTRIES}},
            { [country && country.name || $t('Country')]: {
               name: ROUTES.COUNTRY,
               params: {id: country && country.id}
            }
            },
            { [city && city.name || $t('City')]: {
               name: ROUTES.CITY,
               params: {id: city && city.id}
            }}
         ]"
         :created="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.shortName"
         :is-loading="model | isReading('shortName')"
      />

      <LazyData
         v-model="model"
         :editable="isTeacher"
      >
         <LazyProperty>longName</LazyProperty>
      </LazyData>
   </div>
</template>

<script lang="ts">
import {Component, Prop, Mixins} from 'vue-property-decorator';
import {Getter, Action, State} from 'vuex-class';
import {City, Country, University} from '@/models';
import * as actions from '@/store/actionTypes';
import {PageHeader, List, ModelInfo, Section, PageHeaderAction} from '@/components';
import {ROUTES} from '@/router';
import ModelById from '@/components/mixins/ModelById';
import {RouterPush} from '@/components/decorators';
import {actionName, MODULES} from '@/store/actionTypes';
import ReactiveUpdate, {reactiveUpdate} from '@/components/mixins/ReactiveUpdate';
import {UniversityModel} from '@/models/university';
import LazyData from '@/containers/LazyData.vue';
import LazyProperty from '@/containers/LazyProperty.vue';

@Component({
   components: {
      PageHeader,
      List,
      Section,
      Action: PageHeaderAction,
      LazyData,
      LazyProperty,
   },
})
export default class UniversityView extends Mixins(ReactiveUpdate) {

   @Prop({
      type: String,
      required: true,
   })
   public id!: string;

   get model() {
      return UniversityModel.findOne(this.id, reactiveUpdate(this));
   }

   get city() {
      return this.model && this.model.city;
   }

   get country() {
      return this.city && this.city.country;
   }

   @Getter public isTeacher!: boolean;

   public ROUTES = ROUTES;

   public add() {
      // TODO
   }

   public validate() {
      // TODO
   }

   // get breadcrumbs(){
   //    let result: {[key: string]: any} = [
   //       {[this.$t('Country') as string]: {name: ROUTES.COUNTRIES}},
   //    ]
   //
   //    const country = this.country
   //    if(country)
   //       result.push({
   //          [country.name]: {name: ROUTES.COUNTRY, params: {id: country.id}}
   //       })
   //
   //    const city = this.city
   //    if(city) {
   //       result.push({
   //          [city.name]: {name: ROUTES.CITY, params: {id: city.id}}
   //       })
   //       return result
   //    }
   //    const model = this.model as University
   //    if(!model)
   //       return result
   //
   //    result.push({
   //       [this.$t('City') as string]: {name: ROUTES.CITY, params: {id: model.cityId}}
   //    })
   //
   //    return result
   // }


}
</script>
