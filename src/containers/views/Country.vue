<template>
   <div class="country">
      <PageHeader
         class="country--header"
         :breadcrumbs="[{'Countries': {name: ROUTES.COUNTRIES}}]"
      >{{country && country.name}}</PageHeader>

      <Section>
         <list
            :headers="[
               {'name': 'Name'},
               {'createdAt': 'Date'}
            ]"
            :items="cities"
         />
      </Section>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {List, PageHeader, Section} from '@/components'
   import * as actions from '@/store/actionTypes';
   import {Country} from "@/models";
   import {ROUTES} from '@/router'

   @Component({
      components: {
         List,
         PageHeader,
         Section
      }
   })
   export default class CountryView extends Vue {

      @Prop({
         type: String,
         required: true
      })
      id: string

      @Getter countryById: (id: string) => Country

      @Action(actions.LOAD_COUNTRY) loadCountry: (id: string) => Promise<Country | undefined>

      ROUTES = ROUTES

      get country() {
         return this.countryById(this.id)
      }

      get cities() {
         const country = this.country
         if(!country)
            return []

         return country.cities || []
      }

      created(){
         const country = this.country
         if(!country || !country.cities)
            this.loadCountry(this.id)
      }
   }
</script>
