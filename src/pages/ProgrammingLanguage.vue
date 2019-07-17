<template>
   <div class="country">
      <PageHeader
         :breadcrumbs="[{[$t('Programming languages')]: {name: ROUTES.PROGRAMMING_LANGUAGES}}]"
         :created="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
         :is-loading="model | isReading('name')"
      />

      <LazyData
         v-model="model"
         :editable="isTeacher"
      >
         <LazyProperty>alias</LazyProperty>
         <LazyProperty>version</LazyProperty>
      </LazyData>

   </div>
</template>

<script lang="ts">
import {Component, Prop, Mixins} from 'vue-property-decorator';
import {Getter, Action, State} from 'vuex-class';
import {PageHeader, Button, List, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView} from '@/components';
import {ROUTES} from '@/router';
import Vue from 'vue';
import {ProgrammingLanguageRepository} from '@/models/programmingLanguage';
import LazyData from '@/containers/LazyData.vue';
import LazyProperty from '@/containers/LazyProperty.vue';

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
      ModelInfo,
      LazyData,
      LazyProperty,
   },
})
export default class ProgrammingLanguageView extends Vue {
   @Prop({
      type: String,
      required: true,
   })
   public id!: string;

   get model() {
      return ProgrammingLanguageRepository.findOne(this.id, () => this.$forceUpdate());
   }

   @Getter public isTeacher!: boolean;

   public ROUTES = ROUTES;

   public add() {
      // TODO
   }

   public validate() {
      // TODO
   }

}
</script>
