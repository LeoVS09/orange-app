<template>
   <div class="country">
      <PageHeader
         :breadcrumbs="[{[$t('Countries')]: {name: ROUTES.COUNTRIES}}]"
         :created="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
      />

      <ModelInfo
         v-if="model"
         v-model="model"
         :properties="[{'code': $t('Code')}]"
      />

      <Section>
         <list
            :headers="[
               {'name': $t('Name')},
               {'updatedAt': $t('Updated')}
            ]"
            :items="model.cities"
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
   import {Country} from "@/models"
   import * as actions from '@/store/actionTypes';
   import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
   import {ROUTES} from '@/router'
   import ModelById from "@/components/mixins/ModelById";
   import {City} from "@/models/country";
   import {RouterPush} from "@/components/decorators";
   import {actionName, MODULES} from '@/store/actionTypes';
   import Vue from 'vue'
   import {CountryModel} from '@/models/country'

   const entityName = 'country'

   @Component({
      components: {
         PageHeader,
         Button,
         Filters,
         List,
         Tags,
         Section,
         TextSection,
         Action: PageHeaderAction,
         DataView,
         ModelInfo
      }
   })
   export default class CountryView extends Vue {
      @Prop({
         type: String,
         required: true
      })
      id: string

      get model(){
         return CountryModel.findOne(this.id, () => this.$forceUpdate())
      }

      @Getter isTeacher: boolean;

      @Action(actionName(MODULES.COUNTRIES, actions.READ))
      loadModel: (id: string) => Promise<boolean>

      ROUTES = ROUTES

      add() {
         // TODO
      }

      validate(){
         // TODO
      }

      @RouterPush(ROUTES.CITY)
      chooseItem: (city: City) => void

   }
</script>
