<template>
   <div class="university">
      <PageHeader
         :createdAt="model && model.createdAt"
         :modified="model && model.updatedAt"
         v-model="model && model.shortName"
         :is-loading="model | isReading('shortName')"
      >
         <template #breadcrumbs>
            <breadcrumb :to="{name: ROUTES.COUNTRIES}">{{'Countries' | translate}}</breadcrumb>
            <breadcrumb :to="{
               name: ROUTES.COUNTRY,
               params: {id: country && country.id}
            }">{{country.name || $t('Country')}}</breadcrumb>
            <breadcrumb :to="{
               name: ROUTES.CITY,
               params: {id: city && city.id}
            }">{{city.name || $t('City')}}</breadcrumb>
         </template>
      </PageHeader>

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
import {Getter} from 'vuex-class';
import {Section, PageHeaderAction} from '@/components';
import {ROUTES} from '@/router';
import ReactiveUpdate, {reactiveUpdate} from '@/components/mixins/ReactiveUpdate';
import {UniversityRepository} from '@/models/university';
import LazyData from '@/containers/LazyData.vue';
import LazyProperty from '@/containers/LazyProperty.vue';
import {PageHeader, Breadcrumb} from "@/containers";

@Component({
   components: {
      PageHeader,
      Breadcrumb,
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
      return UniversityRepository.findOne(this.id, reactiveUpdate(this));
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
