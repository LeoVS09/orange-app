<template>
   <div class="dynamic-page">
      <PageHeader
         class="dynamic-page--header"
         :breadcrumbs="meta.header.breadcrumbs"
      >
         <template #text>{{headerText}}</template>
         <template v-if="meta.header.ModelObserver && meta.header.ModelObserver.length" #actions>
            <Button
               v-for="action in meta.header.ModelObserver"
               v-if="showButton(action)"
               @click="onClickAction(action)"
               :icon="action.icon"
               :gradient-highlight="false"
               :circle="true"
               :contrast="true"
               :textOnHover="true"
            >{{action.text}}</Button>
         </template>
      </PageHeader>
      <Tags
         v-if="tags"
         :values="tags"
      />

      <Section>
         <div class="dynamic-page--filters">

            <ButtonGroup
               v-if="meta.list && meta.list.filters"
               :hoverAnimation="false"
               :meta="{
                  attributes: {
                     gradientHighlight: true
                  },
                  active: activeFilter,
                  buttons: meta.list.filters.buttons
               }"
               @click="onClickFilter"
            />
         </div>

         <list
            v-if="items || listHeaders"
            :headers="listHeaders"
            :items="items"
            :formatData="this.meta.list && this.meta.list.formatItem"
            @choose-item="chooseItem"
         />
      </Section>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import {List, PageHeader, Section, Button, ButtonGroup, Tags} from '@/components/index'
   import {Country} from "@/models";
   import {DynamicPageAction, DynamicPageMeta} from "@/components/types";

   @Component({
      components: {
         List,
         PageHeader,
         Section,
         Button,
         ButtonGroup,
         Tags
      }
   })
   export default class DynamicPage extends Vue {

      meta: DynamicPageMeta

      showButton(action: DynamicPageAction): boolean {
         if(typeof this.meta.header === 'string' || !this.meta.header.actions)
            return false

         if(Array.isArray(this.meta.header.actions))
            return action.showTrigger ? action.showTrigger(this) : true

         if(!this.meta.header.actions.showTrigger)
            return action.showTrigger ? action.showTrigger(this) : true

         if(!this.meta.header.actions.showTrigger(this))
            return false

         return action.showTrigger ? action.showTrigger(this) : true
      }

      get tags(): Array<any> | undefined {
         if(!this.meta.tags)
            return

         return this.meta.tags.getter(this)
      }

      get activeTags(): Array<any> {
         if(!this.meta.tags)
            return []

         return this.meta.tags.active(this)
      }

      onChooseAction(tag: any) {
         if(!this.meta.tags)
            return

         return this.meta.tags.choose(this, tag)
      }

      get headerText(){
         if(typeof this.meta.header === 'string')
            return this.meta.header

         if(typeof this.meta.header.text === 'string')
            return this.meta.header.text

         return this.meta.header.text(this.model)
      }

      get listHeaders() {
         if(!this.meta.list)
            return

         return this.meta.list.headers
      }



      get activeFilter(){
         if(!this.meta.list || !this.meta.list.filters)
            return

         return this.meta.list.filters.active(this)
      }

      get model(): any {
         if(!this.meta.model || !this.meta.model.getter)
            return

         if(typeof this.meta.model.getter === 'string')
            return this.$store.getters[this.meta.model.getter]

         return this.meta.model.getter(this)
      }

      get items(): Array<any> | undefined {
         if(!this.meta.list)
            return

         if(Array.isArray(this.meta.list.items))
            return this.meta.list.items

         if(this.meta.list.items.getter)
            return this.meta.list.items.getter(this)

         if(this.meta.list.items.fromModel)
            return this.meta.list.items.fromModel(this.model)

         return
      }

      loadItems(){

         if(!this.meta.list || !this.meta.list.actions || !this.meta.list.actions.loadAction)
            return

         return this.meta.list.actions.loadAction(this)
      }

      loadModel(){
         if(!this.meta.model || !this.meta.model.actions || !this.meta.model.actions.loadAction)
            return

         return this.meta.model.actions.loadAction(this)
      }

      loadTags(){
         if(!this.meta.tags || !this.meta.tags.actions || !this.meta.tags.actions.loadAction)
            return

         return this.meta.tags.actions.loadAction(this)
      }

      load(){

         if(this.meta.list && this.meta.list.actions) {
            if(!this.meta.list.actions.loadTrigger || this.meta.list.actions.loadTrigger(this.items))
               this.loadItems()
         }

         if(this.meta.model && this.meta.model.actions) {
            if(!this.meta.model.actions.loadTrigger || this.meta.model.actions.loadTrigger(this.model))
               this.loadModel()
         }

         if(this.meta.tags && this.meta.tags.actions) {
            if(!this.meta.tags.actions.loadTrigger || this.meta.tags.actions.loadTrigger(this.model))
               this.loadTags()
         }
      }

      created(){
         console.log('created')
         this.load()
      }

      onClickAction(action: DynamicPageAction) {
         action.action(this)
      }

      onClickFilter(filter: any) {
         if(!this.meta.list || !this.meta.list.filters)
            return

         return this.meta.list.filters.choose(this, filter)
      }

      chooseItem(country: Country){
         if(!this.meta.list || !this.meta.list.chooseItem)
            return

         return this.meta.list.chooseItem(country)
      }
   }
</script>

<style lang="scss">
   .dynamic-page {
      &--filters {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-end;
      }
   }
</style>
