<template>
   <div class="country">
      <PageHeader
         :createdAt="model.createdAt"
         :modified="model.updatedAt"
         v-model="model.name"
         :is-loading="model | isReading('name')"
      >
         <template #breadcrumbs>
            <breadcrumb :to="{name: ROUTES.PROGRAMMING_LANGUAGES}">{'Programming languages' | translate}</breadcrumb>
         </template>
      </PageHeader>

      <lazy-data
         v-model="model"
         :editable="isTeacher"
      >
         <lazy-property>alias</lazy-property>
         <lazy-property>version</lazy-property>
      </lazy-data>

   </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Getter, Action, State } from 'vuex-class'
import Vue from 'vue'
import {
  Button, Tags, Input, ModelInfo, Section, TextSection, PageHeaderAction, Filters, DataView
} from '@/components'
import { ROUTES } from '@/router'
import { ProgrammingLanguageRepository } from '@/models/programmingLanguage'
import LazyData from '@/containers/LazyData.vue'
import LazyProperty from '@/containers/LazyProperty.vue'
import {
  List, ListColumn, PageHeader, Breadcrumb
} from '@/containers'

@Component({
  components: {
    PageHeader,
    Breadcrumb,
    Button,
    Filters,
    List,
    ListColumn,
    Tags,
    Section,
    TextSection,
    Action: PageHeaderAction,
    DataView,
    ModelInfo,
    LazyData,
    LazyProperty
  }
})
export default class ProgrammingLanguageView extends Vue {
   @Prop({
     type: String,
     required: true
   })
   public id!: string;

   get model() {
     return ProgrammingLanguageRepository.findOne(this.id, () => this.$forceUpdate())
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
