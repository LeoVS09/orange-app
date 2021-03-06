<template>
   <div :class="{
      'page-header': true,
      highlight,
      success: colorLine === ColorLineType.success,
      error: colorLine === ColorLineType.error,
      'text-width': textWidth,
      breadcrumbs: !!breadcrumbs.length
   }">
      <div class="page-header--hidden-breadcrumbs"><slot name="breadcrumbs"></slot></div>
      <div class="page-header--breadcrumbs" v-if="breadcrumbs.length">
         <template v-for="step in breadcrumbs">
            <router-link
               v-if="step.link"
               class="page-header--breadcrumb-step link"
               :key="step.label"
               :to="step.link"
            >{{step.label}}</router-link>
            <span
              :key="step.label"
               v-else
               class="page-header--breadcrumb-step"
            >{{step.label}}</span>

            <span
              class="page-header--breadcrumb-separator"
              :key="step.label + 'separator'"
            >/</span>
         </template>
      </div>

      <div
         v-if="isLoading"
         class="header-loading"
      ><div class="skeleton-loading"></div></div>

      <input
         v-else-if="editable"
         class="page-header--input"
         type="text"
         :value="value"
         @input="updateValue"
         :placeholder="placeholder"
      />

      <div v-else class="page-header--content">
         <h1>
            <slot><slot name="text">{{value}}</slot></slot>
         </h1>
         <div class="page-header--actions">
            <slot name="actions"></slot>
         </div>
         <color-line v-if="colorLine" :type="colorLine" />
      </div>

      <div class="page-header--data" v-if="dataValues">
         <div class="page-header--data-content">
            <data-view
               in-row
               contrast
               small
               :compact="false"
               :values="dataValues"
               :order="['Created', 'Modified']"
               :icons="{
                  Created: 'publish',
                  Modified: 'edit'
               }"
            />
         </div>
      </div>

   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Emit,
  Provide
} from 'vue-property-decorator'
import ColorLine from '@/components/ColorLine.vue'
import { ColorLineType, Breadcrumb, AddBreadcrumbMethod } from '@/components/types'
import { formatDate, randomId } from '../components/utils'
import DataView from '../components/DataView.vue'

export interface IVisibleBreadcrumbs {
   name: string;
   link?: object;
}

@Component({
  components: {
    ColorLine,
    DataView
  }
})
export default class PageHeader extends Vue {
   @Prop({
     type: Boolean,
     default: true
   })
   public highlight?: boolean;

   @Prop({
     type: Boolean,
     default: false
   })
   public editable?: boolean;

   @Prop({
     type: String,
     default: ''
   })
   public value?: string;

   @Prop({
     type: [String, Boolean]
   })
   public colorLine?: ColorLineType;

   @Prop({
     type: Boolean,
     default: false
   })
   public textWidth?: boolean;

   @Prop({
     type: String
   })
   public placeholder?: string;

   @Prop(Date)
   public createdAt?: Date;

   @Prop(Date)
   public modified?: Date;

   @Prop(Boolean)
   public isLoading?: boolean;

   public ColorLineType = ColorLineType;

   public pageHeaderId = 'default'

   public breadcrumbs: Array<Breadcrumb> = [];

   created() {
     this.pageHeaderId = `page-header-${randomId()}`
   }

   @Provide()
   addBreadcrumb: AddBreadcrumbMethod = ({ id, label, link }) => {
     console.log('[PageHeader] add breadcrumb', { id, label, link })
     const have = this.breadcrumbs.find(b => b.id === id)
     if (!have) {
       this.breadcrumbs.push({
         id,
         label,
         link
       })
       return
     }

     if (have.label !== label)
       have.label = label

     if (JSON.stringify(have.link) !== JSON.stringify(link))
       have.link = link
   }

   @Emit('input')
   public updateValue(event: any) {
     return event.target.value
   }

   get dataValues() {
     if (!this.createdAt && !this.modified)
       return

     const created = this.createdAt && formatDate(this.createdAt)
     const modified = this.modified && formatDate(this.modified)

     const result: {[key: string]: string} = {}

     if (modified)
       result.Modified = modified

     if (created)
       result.Created = created

     return result
   }
}
</script>

<style scoped lang="scss">
   @import "../styles/config";
   @import "../styles/skeleton";

   .header-loading {
      height: 1.5rem;
      width: 20rem;
      padding: 0 2rem;
      overflow: hidden;
      margin-top: 1rem;

      .skeleton-loading {
         width: 40rem;
         height: 3rem;
         margin-left: 3rem;
         margin-right: auto;
         margin-top: -0.5rem;

         @include skeleton(20rem, 3rem, (
               (0, 0.5rem, 22rem, 1.5rem),
         ),
            rgba(236, 236, 236, 0.73),
            #FD911F
         );
      }
   }

   .page-header {
      width: 100%;
      margin-bottom: 0;
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      min-height: 5rem;
      position: relative;

      &--hidden-breadcrumbs {
         display: none;
      }

      &--breadcrumbs {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-start;
         padding: 0;
         color: $secondary-text-color;
         font-size: 0.9rem;
         font-weight: 400;
         margin: 0 auto;
         max-width: $max-content-width;
         box-sizing: border-box;

         z-index: 1;
      }

      &--breadcrumb-separator {
         padding: 0 0.4rem;
         font-weight: bold;
      }

      &--breadcrumb-step.link {
         text-decoration: none;
         color: $secondary-text-color;
         font-size: 0.9rem;
         font-weight: 400;

         &:hover {
            text-decoration: underline;
         }
      }

      &--content {
         display: flex;
         flex-direction: row;
         width: 100%;
         margin: 0 auto;
         padding: 0 2rem;
         box-sizing: border-box;
         max-width: $max-content-width;
      }

      &--data {
         position: absolute;
         bottom: 0.2rem;
         right: 0;
         left: 0;
         width: 100%;
         display: flex;
         flex-direction: row;

         &-content {
            width: 100%;
            max-width: $max-content-width;
            padding: 0 2rem;
            box-sizing: border-box;
            margin-left: auto;
            margin-right: auto;
         }
      }

      h1, &--input {
         margin: 0 auto 0 0;
         color: $header-text-color;
         font-size: 2.5rem;
         font-weight: bold;
         width: 100%;
         background: transparent;
      }

      &--actions {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-end;
         align-items: center;
      }

      &--input {
         border: none;
         width: 100%;
         outline: none;
         font-family: Roboto, sans-serif;
         max-width: $max-content-width;
         margin: 0 auto;
         padding: 0 2rem;
         box-sizing: border-box;
      }

      &.text-width {
         .page-header--content {
            padding: 0;
            max-width: $max-text-width;
         }

         .page-header--breadcrumbs {
            max-width: $max-text-width;
         }

         .page-header--input {
            padding: 0;
            max-width: $max-text-width;
         }
      }

      &.highlight {
         background: $active-gradient;
         margin-top: 0;

         h1, .page-header--input {
            color: $highlight-header-text-color;
         }

         .page-header--content {
            padding: 1rem $highlight-header-padding-sides;
         }

         &.breadcrumbs .page-header--content {
            padding-top: 0;
         }

         .page-header--breadcrumbs {
            padding: 0.3rem $highlight-header-padding-sides 0;
            color: $breadcrumbs-highlight-color;
            margin-bottom: -0.4rem;
         }

         .page-header--breadcrumb-step.link {
            color: $breadcrumbs-highlight-color;
         }
      }

      &.success {
         h1 {
            color: $success-color;
         }
      }

      &.error {
         h1 {
            color: $error-color
         }
      }

   }
</style>
