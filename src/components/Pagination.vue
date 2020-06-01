<template>
      <div
         class="pagination"
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
         <div class="pagination--numbers">
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
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import Button from './Button.vue'
import { GoToPageEvent } from './types'

export interface IPageNumbers {
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
    Button
  }
})
export default class Pagination extends Vue {

    @Prop({
      type: Number,
      required: true
    })
    pagesCount!: number;

    @Prop({
      type: Number,
      required: true
    })
    currentPage!: number;

    @Prop({
      type: Number,
      default: 5
    })
    maxPageNumbers!: number;

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

    @Emit('next-page')
    public nextPage() {
      const nextPage = this.currentPage + 1
      if (nextPage > this.pagesCount)
        return

      this.goToPage(nextPage)
    }

    @Emit('previous-page')
    public previousPage() {
      const nextPage = this.currentPage - 1
      if (nextPage < 1)
        return

      this.goToPage(nextPage)
    }

    @Emit('to-page')
    public goToPage(next: number): GoToPageEvent {
      const old = this.currentPage

      return {
        old,
        next
      }
    }

}

</script>

<style lang="scss">

.pagination {
    padding: 1rem 2rem;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;

    &--numbers {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
}

</style>
