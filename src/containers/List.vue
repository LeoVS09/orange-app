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
               v-for="header in headers"
               @click="onClickHeader(header)"
               :key="header.label"
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
            ><slot name="add">Add</slot></Button>
         </div>

         <transition-group :name="listTransitionName" tag="div" mode="out-in">

            <list-item
               v-for="(item, index) in visibleItems"
               @click="onClickItem(item)"
               :visibleProps="headers.map(h => h.key)"
               :key="item ? hash(item) : index"
               :item="item"
               :formatData="formatData"
               @list-item-over="onItemOver(item)"
               @list-item-leave="onItemLeave(item)"
               @list-item-move="onItemMove(item)"
            />

         </transition-group>
      </div>

      <div
         v-if="pagesCount"
         class="list--pagination"
      >
         <Button
            @click="previousPage"
            icon="navigate_before"
            :simple="true"
            :textOnHover="true"
            :gradient-highlight="false"
            :static-size="true"
         ><slot name="previous">Previous</slot>
         </Button>
         <div class="list--pages">
            <template
               v-if="page = pageNumbers.left"
            >
               <Button
                  @click="goToPage(page.n)"
                  :simple="true"
                  :active="page.n === currentPage"
                  :gradient-highlight="false"
               >{{page.n}}
               </Button>
               <span v-if="page.points">...</span>
            </template>
            <Button
               v-for="page in pageNumbers.center"
               :key="page"
               @click="goToPage(page)"
               :simple="true"
               :active="page === currentPage"
               :gradient-highlight="false"
            >{{page}}
            </Button>
            <template
               v-if="page = pageNumbers.right"
            >
               <span v-if="page.points">...</span>
               <Button
                  @click="goToPage(page.n)"
                  :simple="true"
                  :active="page.n === currentPage"
                  :gradient-highlight="false"
               >{{page.n}}
               </Button>
            </template>
         </div>
         <Button
            @click="nextPage"
            icon="navigate_next"
            :simple="true"
            :icon-left="false"
            :textOnHover="true"
            :gradient-highlight="false"
            :static-size="true"
         ><slot name="next">Next</slot>
         </Button>
      </div>
   </div>
</template>

<script lang="ts">
import {
  Component, Prop, Emit, Mixins
} from 'vue-property-decorator'
import crypto from 'crypto-js'
import Loadable from '@/components/mixins/loadable'
import { randomId } from '@/components/utils'
import ListItem from '../components/ListItem.vue'
import Button from '../components/Button.vue'
import {
  ListEvents,
  DataItem,
  Header,
  ListMeta,
  ListSortEvent
} from '../components/types'
// @ts-ignore

export interface ListSortHeader {
   by: string;
   ascending: boolean;
}

function toHeaders(headers: any[]): Header[] {
  return headers.map((header) => {
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

interface IPageNumbers {
   left?: {
      n: number,
      points: boolean,
   };
   center: number[];
   right?: {
      n: number,
      points: boolean,
   };
}

@Component({
  components: {
    ListItem,
    Button
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
     default: 5
   })
   public maxPageNumbers!: number;

   // @Prop(Boolean)
   // public isLoading!: boolean

   public currentPage: number = 1;

   public isHovered = false;

   public sortHeader: ListSortHeader | null = null;

   // TODO: make consistently items animation
   public listTransitionName = listTransitionDown;

   public listId: string = 'default';

   public headers: Array<Header> = [];

   created() {
     this.listId = `list-${randomId()}`
     this.headers = []
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

   get pageNumbers(): IPageNumbers {
     const count = this.pagesCount
     const current = this.currentPage
     const max = this.maxPageNumbers
     const middle = max / 2

     const allPages = new Array(count).fill(0).map((v, i) => i + 1)

     const firstPage = allPages[0]
     const lastPage = allPages[allPages.length - 1]

     if (current < middle) {
       return {
         center: allPages.slice(0, max),
         right: count > max ? {
           n: lastPage,
           points: true
         } : undefined
       }
     }

     if (count - current < middle) {
       return {
         left: count > max ? {
           n: firstPage,
           points: true
         } : undefined,
         center: max >= allPages.length
           ? allPages.slice(0, allPages.length)
           : allPages.slice(allPages.length - max)
       }
     }

     const start = current - Math.floor(middle)
     const end = current + Math.floor(middle)

     let left

     if (firstPage !== start) {
       left = {
         n: firstPage,
         points: false
       }

       if (start - firstPage > 1)
         left.points = true
     }

     let right

     if (lastPage !== end) {
       right = {
         n: lastPage,
         points: false
       }

       if (lastPage - end > 1)
         right.points = true
     }

     return {
       left,
       center: allPages.slice(start - 1, end),
       right
     }
   }

   public nextPage() {
     this.listTransitionName = listTransitionFade

     if (this.currentPage + 1 > this.pagesCount)
       return

     const page = this.currentPage + 1
     this.$emit(ListEvents.nextPage, page)

     this.goToPage(page)

     // TODO: refactor, need use js animation in this case
     setTimeout(() => this.listTransitionName = listTransitionDown, 1000)
   }

   public previousPage() {
     this.listTransitionName = listTransitionFade

     if (this.currentPage <= 1)
       return

     const page = this.currentPage - 1
     this.$emit(ListEvents.previousPage, page)

     this.goToPage(page)

     setTimeout(() => this.listTransitionName = listTransitionDown, 1000)
   }

   @Emit(ListEvents.toPage)
   public goToPage(next: number) {
     const old = this.currentPage
     this.currentPage = next

     return {
       old,
       next
     }
   }

   public hash(item: Object): string {
     return crypto.MD5(JSON.stringify(item)).toString()
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

      &--pagination {
         padding: 1rem 2rem;
         box-sizing: border-box;
         display: flex;
         width: 100%;
         flex-direction: row;
         justify-content: space-between;
      }

      &--pages {
         display: flex;
         flex-direction: row;
         justify-content: center;
         align-items: center;
      }

      &-item-down, &-pagination.pagination-down {
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
