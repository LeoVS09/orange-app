<template>
   <div class="university">
      <PageHeader
         :createdAt="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.shortName"
         :is-loading="false"
         :key="reactive"
      >
         <template #breadcrumbs>
            <breadcrumb :to="{name: ROUTES.COUNTRIES}">{{'Countries' | translate}}</breadcrumb>
            <breadcrumb :to="{
               name: ROUTES.COUNTRY,
               params: {id: model.city.country.id}
            }">{{model.city.country.name || $t('Country')}}</breadcrumb>
            <breadcrumb :to="{
               name: ROUTES.CITY,
               params: {id: model.city.id}
            }">{{model.city.name || $t('City')}}</breadcrumb>
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
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { Section, PageHeaderAction } from '@/components'
import { ROUTES } from '@/router/routes'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'
import LazyData from '@/containers/LazyData.vue'
import LazyProperty from '@/containers/LazyProperty.vue'
import { PageHeader, Breadcrumb } from '@/containers'
import { UniversityRepository } from '@/db'

@Component({
  components: {
    PageHeader,
    Breadcrumb,
    Section,
    Action: PageHeaderAction,
    LazyData,
    LazyProperty
  }
})
export default class UniversityView extends Mixins(ReactiveUpdate) {
   @Prop({
     type: String,
     required: true
   })
   public id!: string;

   get model() {
     return UniversityRepository.findOne(this.id, reactiveUpdate(this))
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
