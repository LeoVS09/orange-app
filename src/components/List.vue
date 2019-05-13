<template>
   <div class="list-container"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
   >
      <div class="list">
         <div class="list--header">
            <div
               class="list--header-item"
               v-for="headerItem in visibleHeaders"
               @click="onClickHeader(headerItem)"
            >{{headerItem.label}}</div>
         </div>
         <div name="list-item-down" is="transition-group" mode="out-in" class="list--body">
            <list-item
               v-for="item in visibleItems"
               @click="onClickItem(item)"
               :visibleProps="visibleHeaders.map(h => h.key)"
               :key="hash(item)"
               :item="item"
               :formatData="formatData"
            />
         </div>
      </div>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import ListItem from './ListItem.vue';
   import Button from './Button.vue';
   import {Component, Prop} from 'vue-property-decorator'
   import {ListEvents, DataItem, Header, ListMeta} from './types'
   // @ts-ignore
   import crypto from 'crypto-js'

   function toHeaders(keys: Array<any>): Array<Header> {
      return keys.map(key => {
         if(typeof key !== 'string')
            return key

         return {
            key,
            label: key.slice(0, 1).toUpperCase() + key.slice(1)
         }
      })
   }

   @Component({
      components: {
         ListItem,
         Button
      }
   })
   export default class List extends Vue {

      @Prop({
         type: Array,
         required: true
      })
      items: Array<DataItem>

      @Prop({
         type: Array
      })
      headers?: Array<Header | string>

      @Prop({
         type: Array
      })
      exceptions?: Array<string>

      @Prop({
         type: Object
      })
      meta: ListMeta

      @Prop({
         type: Function
      })
      filter?: (item: DataItem) => boolean

      @Prop({
         type: Function
      })
      formatData?: (a: DataItem) => DataItem

      @Prop({
         type: Boolean
      })
      isCanAdd?: boolean

      isHovered = false;

      get visibleHeaders(): Array<Header> {
         if(this.headers)
            return toHeaders(this.headers)

         if(this.items.length)
            return toHeaders(Object.keys(this.items[0]))

         return []
      }

      get visibleItems() {
         if(this.filter)
            return this.filter(this.items)

         return this.items
      }

      hash(item: Object): string {
         return crypto.MD5(JSON.stringify(item)).toString()
      }

      onClickHeader(header: Header){
         this.$emit(ListEvents.chooseHeader, header)
      }

      onClickItem(item: DataItem) {
         this.$emit(ListEvents.chooseItem, item)
      }

      onClickAdd(){
         this.$emit(ListEvents.add)
      }

      onMouseOver(){
         this.isHovered = true
      }

      onMouseLeave(){
         this.isHovered = false
      }
   }
</script>

<style lang="scss">
   @import "../styles/config";

   .list-container {
      width: 100%;
      margin: 0;
      padding: 0;
   }

   .list {
      width: 100%;
      margin: 0;
      padding: 0;

      &--header {
         width: 100%;
         display: flex;
         flex-direction: row;
         padding-top: 1.5*$problem-line-padding;
         padding-bottom: 1.5*$problem-line-padding;
         transition: box-shadow 0.2s cubic-bezier(.25, .8, .25, 1);
         border-bottom: 1px solid $secondary-color;
         font-weight: bold;
         position: relative;

         &, &:hover {
            box-shadow: none;
            cursor: default;
            color: $main-text-color;
         }

         &-item {
            flex: 1;
            text-align: center;

            &:first-child {
               flex: 3;
               text-align: left;
               padding-left: 1rem;
               text-underline: $main-text-color;
            }
         }

         &-add {
            position: absolute;
            bottom: -$button-font-size;
            left: -1rem;
         }
      }
   }

   .list-item-down-enter-active {
      transition: all 0.2s;
   }

   .list-item-down-leave-active {
      transition: all 0.05s;
   }

   .list-item-down-enter {
      opacity: 0;
      transform: translateY(-1rem);
   }

   .list-item-down-leave-to {
      opacity: 0;
   }
</style>
