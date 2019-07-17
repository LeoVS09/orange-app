<template>
   <div class="countries">
      <PageHeader>
         <template #text>{{'Countries' | translate}}</template>
      </PageHeader>

      <Section>
         <list
            :headers="[
               {'name': $t('Name')},
               {'code': $t('Code')},
               {'updatedAt': $t('Updated')}
            ]"
            :items="list.nodes"
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
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {Getter, Action, State} from 'vuex-class';
import {Country, FullProblem, PartialProblem} from '@/models';
import * as actions from '@/store/actionTypes';
import {PageHeader, Button, List, Tags, Section, PageHeaderAction, Filters} from '@/components';
import {ROUTES} from '@/router';
import {RouterPush} from '@/components/decorators';
import {actionName, MODULES} from '@/store/actionTypes';
import {CountryRepository} from '@/models/country';

@Component({
   components: {
      PageHeader,
      Button,
      Filters,
      List,
      Tags,
      Section,
      Action: PageHeaderAction,
   },
})
export default class Countries extends Vue {


   @Getter public isTeacher!: boolean;

   @RouterPush(ROUTES.COUNTRY)
   public chooseItem!: (country: Country) => void;

   public data() {
      return {
         list: CountryRepository.list(),
      };
   }

   public add() {
      // TODO
   }

   public validate() {
    // TODO
   }

}
</script>
