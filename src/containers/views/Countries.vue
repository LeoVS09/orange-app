<template>
   <div class="countries">
      <PageHeader class="countries--header">Countries</PageHeader>

      <Section>
         <list
            :headers="[
               {'name': 'Name'},
               {'createdAt': 'Date'}
            ]"
            :items="countries"
            @chooseItem="chooseCountry"
         />
      </Section>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {List, PageHeader, Section} from '@/components'
   import * as actions from '@/store/actionTypes';
   import {ROUTES} from "@/router";
   import {Country} from "@/models";

   @Component({
      components: {
         List,
         PageHeader,
         Section
      }
   })
   export default class Countries extends Vue {

      @Getter('allCountries') countries: Array<Countries>

      @Action(actions.LOAD_ALL_COUNTRIES) loadCountries: () => Promise<boolean>

      created(){
         this.loadCountries()
      }

      chooseCountry(country: Country){
         this.$router.push({name: ROUTES.COUNTRY, params: {id: country.id}})
      }
   }
</script>
