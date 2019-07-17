<template>
   <div class="countries">
      <PageHeader>
         <template #text>{{'Programming languages' | translate}}</template>
      </PageHeader>

      <Section>
         <list
            :headers="[
               {'name': $t('Name')},
               {'alias': $t('Alias')},
               {'version': $t('Version')},
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
import {CountryModel} from '@/models/country';
import {ProgrammingLanguageModel} from '@/models/programmingLanguage';

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
export default class ProgrammingLanguages extends Vue {


   @Getter public isTeacher!: boolean;

   @RouterPush(ROUTES.PROGRAMMING_LANGUAGE)
   public chooseItem!: (country: Country) => void;

   public data() {
      return {
         list: ProgrammingLanguageModel.list(),
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
