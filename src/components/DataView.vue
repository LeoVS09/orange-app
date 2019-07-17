<template>
   <div :class="{
      'data-view': true,
      compact,
      'in-row': inRow,
      'model-info': modelInfo,
      contrast,
      small
   }">
      <div
         class="data-view--item"
         v-for="prop in visibleValues"
         @click="choseItem(prop)"
      >
         <Icon v-if="prop.icon" class="data-view--icon">{{prop.icon}}</Icon>
         <span v-else class="data-view--label">{{prop.label}}</span>
         <span class="data-view--value">{{valueToText(prop.value) | formatDate}}</span>
      </div>
   </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Emit} from 'vue-property-decorator';
import {formatDate, isDate} from './utils';
import Icon from './icons/MaterialIcon.vue';
import {Filter} from './decorators';

export interface DataViewValues {
   [label: string]: any;
}

@Component({
   components: {
      Icon,
   },
})
export default class DataView extends Vue {

   @Prop({
      type: Object,
      required: true,
   })
   public values!: DataViewValues;

   @Prop({
      type: Function,
   })
   public formatValue!: (value: any) => any;

   @Prop({
      type: Boolean,
      default: true,
   })
   public compact!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public inRow!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public modelInfo!: boolean;

   @Prop({
      type: Array,
   })
   public order!: string[];

   @Prop({
      type: Array,
   })
   public exclude!: string[];

   @Prop({
      type: Object,
      default: () => ({}),
   })
   public icons!: {[key: string]: string};

   @Prop({
      type: Boolean,
      default: false,
   })
   public contrast!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public small!: boolean;

   get visibleValues() {
      let keys = Object.keys(this.values);

      if (this.order) {
         const notOrdered = keys.filter((k) => this.order.indexOf(k) === -1);
         const have = this.order.filter((k) => keys.indexOf(k) !== -1);

         keys = [
            ...have,
            ...notOrdered,
         ];
      }

      if (this.exclude) {
         keys = keys.filter((k) => this.exclude.indexOf(k) === -1);
      }


      return keys.map((label) => {
         const value = this.values[label];

         const icon = this.icons[label];

         return {label, icon, value};
      });
   }

   public valueToText(value: any) {
      if (this.formatValue) {
         return this.formatValue(value);
      }

      return value;
   }

   @Emit('click')
   public choseItem(value: {label: string, value: any}) {
      return value;
   }
}
</script>

<style scoped lang="scss">
   @import "../styles/config.scss";

   .data-view {
      width: 100%;
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      padding-bottom: 2rem;

      &.compact {
         max-width: 20rem;
      }

      &.small {
         font-size: 0.9rem;
      }

      &--item {
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: space-between;
         margin-bottom: 0.7rem;
      }

      &.in-row {
         display: flex;
         flex-direction: row;
         justify-content: flex-end;
         margin-top: 1rem;
         padding-bottom: 0;

         .data-view--item {
            max-width: 10rem;
            margin-right: 0.5rem;
            margin-bottom: 0;
         }
      }

      &.small &--item {
         width: auto;
      }

      &--label {
         color: $main-text-color;
         font-weight: bold;
      }

      &--icon {
         color: $main-text-color;
         margin-top: -0.5rem;
         margin-left: auto;
         margin-right: 1rem;
      }

      &--value {
         color: $secondary-text-color;
         font-weight: normal;
      }


      &.small &--icon {
         margin-right: 0.5rem;
         font-size: 1rem;
         margin-top: -0.1rem;
      }


      &.contrast &--label, &.contrast &--icon {
         color: $highlight-header-text-color;
      }

      &.contrast &--value {
         color: $breadcrumbs-highlight-color;
      }

      &.model-info {
         width: 100%;
         max-width: none;

         .data-view--label {
            width: 100%;
            max-width: 20rem;
         }

         .data-view--value {
            width: 100%;
            text-align: left;
         }
      }
   }


</style>
