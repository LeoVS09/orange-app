<template>
   <div :class="{
      'data-view': true,
      compact,
      'in-row': inRow,
      'model-info': modelInfo
   }">
      <div
         class="data-view--item"
         v-for="prop in visibleValues"
         @click="choseItem(prop)"
      >
         <Icon v-if="prop.icon">{{prop.icon}}</Icon>
         <span v-else class="data-view--label">{{prop.label}}</span>
         <span class="data-view--value">{{valueToText(prop.value)}}</span>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import {formatDate, isDate} from "./utils";
   import Icon from './icons/MaterialIcon.vue'

   export interface DataViewValues {
      [label: string]: any
   }

   @Component({
      components: {
         Icon
      }
   })
   export default class DataView extends Vue {

      @Prop({
         type: Object,
         required: true
      }) values: DataViewValues

      @Prop({
         type: Function
      })
      formatValue: (value: any) => any

      @Prop({
         type: Boolean,
         default: true
      })
      compact: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      inRow: boolean

      @Prop({
         type: Boolean,
         default: false
      })
      modelInfo: boolean

      @Prop({
         type: Array
      })
      order: Array<string>

      @Prop({
         type: Array
      })
      exclude: Array<string>

      @Prop({
         type: Object,
         default: {}
      })
      icons: {[key: string]: string}

      get visibleValues(){
         let keys = Object.keys(this.values)

         if(this.order) {
            let notOrdered = keys.filter(k => this.order.indexOf(k) === -1)
            keys = [
               ...this.order,
               ...notOrdered
            ]
         }

         if(this.exclude)
            keys = keys.filter(k => this.exclude.indexOf(k) === -1)


         return keys.map(label => {
            const value = this.values[label]

            const icon = this.icons[label]

            return {label, icon, value}
         })
      }

      valueToText(value: any) {
         if(this.formatValue)
            return this.formatValue(value)

         if (isDate(value))
            return formatDate(value)

         return value
      }

      @Emit('click')
      choseItem(value: {label: string, value: any}) {
         return value
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
         padding-bottom: 0.5rem;

         .data-view--item {
            max-width: 10rem;
            margin-right: 1rem;
         }
      }

      &--label {
         color: $main-text-color;
         font-weight: bold;
      }

      &--value {
         color: $secondary-text-color;
         font-weight: normal;
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
