<template>
   <Section
      class="lazy-data"
      without-margin
      border-bottom
   >
      <div class="lazy-data--main">
         <h4 class="lazy-data--header">{{'Information' | translate}}</h4>

         <div class="lazy-data--hidden-columns"><slot></slot></div>

         <div class="lazy-data--content">
            <div
               v-for="prop in dataItems"
               :key="prop.label"
               class="lazy-data--item"
            >
               <span class="lazy-data--label">{{prop.label | normalise | capitalise | translate}}</span>
               <div
                  v-if="$isReading(value, prop.key)"
                  class="lazy-data--loading"
               >
                  <div class="skeleton-loading"></div>
               </div>
               <span v-else class="lazy-data--value">{{value[prop.key] | formatDate}}</span>
            </div>
         </div>
      </div>
   </Section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { Section } from '@/components'
import { randomId } from '@/components/utils'
import { Filter } from '@/components/decorators'

export interface DataItem {
   key: string;
   label: string;
}

export interface PropertiesStore {
   [key: string]: string;
}

@Component({
  components: {
    Section
  }
})
export default class LazyData extends Vue {
   @Prop({
     type: Object,
     required: true
   })
   public value!: {[key: string]: any};

   @Prop({
     type: Boolean,
     default: false
   })
   public editable!: boolean;

   public properties: PropertiesStore = {};

   public lazyDataId: string = 'default';

   get dataItems(): DataItem[] {
     console.log('LazyData slots', this.$slots)

     const properties = Object.keys(this.properties).map((key) => ({
       key,
       label: this.properties[key]
     }))
     console.log('LazyData properties', properties)
     return properties
   }

   public created() {
     this.lazyDataId = `lazy-data-${randomId()}`
     this.properties = {}
   }
}
</script>

<style lang="scss">
   @import "../styles/config.scss";
   @import "../styles/skeleton";

   .lazy-data {
      width: 100%;
      &--header {
         margin-bottom: 4rem;
      }

      &--hidden-columns {
         display: none;
      }

      &--content {
         width: 100%;
         max-width: none;
         font-size: 1rem;
         display: flex;
         flex-direction: column;
         padding-bottom: 2rem;
      }

      &--item {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         margin-bottom: 0.7rem;
      }

      &--label {
         color: $main-text-color;
         font-weight: bold;
         width: 100%;
         max-width: 20rem;
      }

      &--value {
         color: $secondary-text-color;
         font-weight: normal;
         width: 100%;
         text-align: left;
      }

      &--loading {
         height: 1.5rem;
         width: 100%;
         text-align: left;
         overflow: hidden;

         .skeleton-loading {
            width: 40rem;
            height: 3rem;
            margin-left: 0;
            margin-right: auto;
            margin-top: -0.5rem;

            @include skeleton(20rem, 3rem, (
                  (0, 0.5rem, 22rem, 1.5rem),
            ));
         }
      }
   }
</style>
