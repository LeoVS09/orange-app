<template>
   <div class="list--container"
        @mouseover="onMouseOver"
        @mouseleave="onMouseLeave"
   >
      <div class="list--hidden-columns"><slot></slot></div>

      <div class="list">
         <div class="list--header">
            <div
               class="list--header-item"
               v-for="(header, index) in headers"
               @click="onClickHeader(header)"
               :key="hash({ header, index })"
            >
               <span class="list--header-text">{{header.label | normalise | capitalise | translate}}</span>
               <div
                  :class="{
                     'list--header-sort-arrow': true,
                     'up': sortHeader && sortHeader.ascending
                  }">
                  <span v-if="sortHeader && sortHeader.by === header.key">&#9662;</span>
               </div>
            </div>
         </div>

         <div class="list--add" v-if="isCanAdd">
            <Button
               class="list--add-button"
               icon="add"
               @click="onClickAdd"
               simple
               ghost
               :gradientHighlight="false"
               maxWidth
               maxHeight
               leftAlign
            >
              <slot name="add">Add</slot>
            </Button>
         </div>

         <transition-group :name="listTransitionName" tag="div" mode="out-in">

            <list-item
               v-for="(item, index) in visibleItems"
               @click="onClickItem(item)"
               :visibleProps="headers.map(h => h.key)"
               :key="hash({ item, index })"
               :item="item"
               :formatData="formatData"
               @list-item-over="onItemOver(item)"
               @list-item-leave="onItemLeave(item)"
               @list-item-move="onItemMove(item)"
            />

         </transition-group>
      </div>

      <Pagination
        v-if="pagesCount && pagination"
        :pagesCount="pagesCount"
        :currentPage="currentPage"
        :maxPageNumbers="maxPageNumbers"
        @to-page="goToPage"
        @previous-page="previousPage"
        @next-page="nextPage"
      />
   </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Emit,
  Mixins,
  Provide
} from 'vue-property-decorator'
import Loadable from '@/components/mixins/loadable'
import hash from 'object-hash'
import {
  ListItem,
  Button,
  ListEvents,
  DataItem,
  Header,
  ListMeta,
  ListSortEvent,
  AddHeaderMethod,
  randomId,
  GoToPageEvent,
  Pagination
} from '@/components'

export interface ListSortHeader {
   by: string;
   ascending: boolean;
}

function toHeaders(headers: any[]): Header[] {
  return headers.map(header => {
    if (typeof header === 'string') {
      return {
        key: header,
        label: header.slice(0, 1).toUpperCase() + header.slice(1)
      }
    }

    const keys = Object.keys(header)
    if (keys.length > 1)
      return header

    return {
      key: keys[0],
      label: header[keys[0]]
    }
  })
}

const listTransitionDown = 'list-item-down'
const listTransitionFade = 'list-item-fade'

@Component({
  components: {
    ListItem,
    Button,
    Pagination
  }
})
export default class List extends Mixins(Loadable) {
   @Prop({
     type: Array,
     required: true
   })
   public items!: Array<DataItem>;

   @Prop({
     type: Array
   })
   public exceptions?: Array<string>;

   @Prop({
     type: Object
   })
   public meta!: ListMeta;

   @Prop({
     type: Function
   })
   public filter?: (item: DataItem) => boolean;

   @Prop({
     type: Function
   })
   public formatData?: (a: DataItem) => DataItem;

   @Prop({
     type: Boolean
   })
   public isCanAdd?: boolean;

   @Prop({
     type: Boolean,
     default: true
   })
   public pagination!: boolean;

   @Prop({
     type: Number,
     default: 10
   })
   public itemsOnPage!: number;

   @Prop({
     type: Number,
     required: false
   })
   public maxPageNumbers!: number;

   // @Prop(Boolean)
   // public isLoading!: boolean

   public currentPage: number = 1;

   public isHovered = false;

   public sortHeader: ListSortHeader | null = null;

   // TODO: make consistently items animation
   public listTransitionName = listTransitionDown;

   public headers: Array<Header> = [];

   @Provide()
   addHeader: AddHeaderMethod = header => {
     console.log('[List] add header', header, this.headers)

     if (this.headers.some(h => h.key === header.key))
       return

     this.headers.push(header)
   }

   get visibleItems(): DataItem[] {
     let result = this.items
     console.log('List component items', result)

     if (this.filter)
       result = result.filter(this.filter)

     if (this.sortHeader) {
       const { by, ascending } = this.sortHeader

       result = result.slice().sort((a, b) => {
         const aValue = a[by]
         const bValue = b[by]

         if (aValue === bValue)
           return 0

         if (!ascending)
           return aValue < bValue ? 1 : -1

         return aValue > bValue ? 1 : -1
       })
     }

     if (!this.pagination)
       return result

     const start = (this.currentPage - 1) * this.itemsOnPage
     const resultItems = result.slice(start, start + this.itemsOnPage)
     console.log('list', resultItems, 'headers', this.headers)
     return resultItems
   }

   get pagesCount() {
     if (this.items.length <= this.itemsOnPage)
       return 0

     return Math.ceil(this.items.length / this.itemsOnPage)
   }

   @Emit(ListEvents.nextPage)
   public nextPage() {
     this.listTransitionName = listTransitionFade

     // TODO: refactor, need use js animation in this case
     setTimeout(() => this.listTransitionName = listTransitionDown, 1000)
   }

   @Emit(ListEvents.previousPage)
   public previousPage() {
     this.listTransitionName = listTransitionFade

     setTimeout(() => this.listTransitionName = listTransitionDown, 1000)
   }

   @Emit(ListEvents.toPage)
   public goToPage({ old, next }: GoToPageEvent) {
     this.currentPage = next

     return { old, next }
   }

   public hash(data: Object): string {
     return hash(data)
   }

   public onClickHeader(header: Header) {
     this.$emit(ListEvents.clickHeader, header)

     this.sort(header)
   }

   @Emit(ListEvents.sort)
   public sort(header: Header) {
     if (this.sortHeader && this.sortHeader.by === header.key) {
       return this.sortHeader = {
         ...this.sortHeader,
         ascending: !this.sortHeader.ascending
       } as ListSortEvent
     }

     return this.sortHeader = {
       by: header.key,
       ascending: false
     } as ListSortEvent
   }

   @Emit(ListEvents.chooseItem)
   public onClickItem(item: DataItem) {
     return item
   }

   @Emit(ListEvents.add)
   public onClickAdd() {

   }

   public onMouseOver() {
     this.isHovered = true
   }

   public onMouseLeave() {
     this.isHovered = false
   }

   @Emit(ListEvents.onItemOver)
   public onItemOver(item: DataItem) {
     return item
   }

   @Emit(ListEvents.onItemLeave)
   public onItemLeave(item: DataItem) {
     return item
   }

   @Emit(ListEvents.onItemMove)
   public onItemMove(item: DataItem) {
     return item
   }
}
</script>

<style lang="scss">
   @import "../styles/config";

   .list {
      width: 100%;
      margin: 0;
      padding: 0;
      position: relative;

      &--container {
         width: 100%;
         margin: 0;
         padding: 0;
      }

      &--hidden-columns {
         display: none;
      }

      &--add, &--add-button {
         width: 100%;
      }

      &--add {
         border-bottom: 1px dashed $secondary-color;
         transition: height $default-animation-time;
         height: 1.2rem;

         &:hover {
            height: 1.8rem;
            border-bottom-style: solid;
         }
      }

      &--add-button {
         height: 100%;
         padding-left: 0.3rem;
      }

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

         &-text {
            user-select: none;
         }

         &-item {
            flex: 1;
            display: flex;
            flex-direction: row;
            cursor: pointer;
            justify-content: center;

            &:first-child {
               flex: 3;
               justify-content: flex-start;
               padding-left: 1rem;
               text-underline: $main-text-color;
            }
         }

         &-sort-arrow {
            transition: $input-animation-time all;
            min-height: 1.35rem;
            min-width: 1rem;

            span {
               position: relative;
            }

            &.up {
               transform: rotate(180deg);

               span {
                  top: 0.15rem
               }
            }
         }

         &-add {
            position: absolute;
            bottom: -$button-font-size;
            left: -1rem;
         }
      }

      &-item-down {
         &-enter-active {
            transition: all 0.1s;
         }

         &-leave-active {
            transition: none;
         }

         &-enter, &-leave-to {
            opacity: 0;
            transform: translateY(-1rem);
         }

         &-move {
            transition: transform 0.1s;
         }
      }

      &-item-fade {
         &-enter-active, &-leave-active {
            transition: all 0.1s;
         }

         &-leave-active {
            display: none;
         }

         &-enter, &-leave-to {
            opacity: 0;
         }
      }
   }
</style>
