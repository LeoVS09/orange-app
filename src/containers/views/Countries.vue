<template>
   <div class="countries">
      <PageHeader>
         <template #text>Countries</template>
      </PageHeader>

      <Section>
         <list
            :headers="[
               {'name': 'Name'},
               {'code': 'Code'},
               {'updatedAt': 'Date'}
            ]"
            :items="items"
            :isCanAdd="isTeacher"
            inlineAdd
            :validateAdd="validate"
            @add="add"
            @choose-item="chooseItem"
            :load="loadItems"
         />
      </Section>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component} from 'vue-property-decorator'
   import {Getter, Action, State} from 'vuex-class'
   import {Country, FullProblem, PartialProblem} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, Button, List, Tags, Section, PageHeaderAction, Filters} from '@/components';
   import {ROUTES} from '@/router'

   @Component({
      components: {
         PageHeader,
         Button,
         Filters,
         List,
         Tags,
         Section,
         Action: PageHeaderAction
      }
   })
   export default class Countries extends Vue {

      @Getter('allCountries') items: Array<Country>;
      @Getter isTeacher: boolean;

      @Action(actions.LOAD_ALL_COUNTRIES) loadItems: () => void

      add() {
         // TODO
      }

      validate(){
       // TODO
      }

      chooseItem({id}: Country) {
         this.$router.push({
            name: ROUTES.COUNTRY,
            params: {id}
         })
      }

   }
</script>
