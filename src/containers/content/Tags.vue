<template>
   <div
      :id="id"
      :class="{tags: true, 'scrollable-horizontal': scrollable}"
   >
      <span class="tags--left-gradient" v-if="scrollable && values && values.length"> </span>
      <ButtonGroup
         class="tags--content"
         v-if="values && values.length"
         :secondary="true"
         :meta="{
               attributes: {
                  simple: true,
                  gradientHighlight: false,
                  noActiveBold: true,
                  simpleActive: true
               },
               active: activeTags,
               buttons: values.map(t => ({ [t.name]: t }))
            }"
         @click="chooseTag"
      />
      <span class="tags--right-gradient" v-if="scrollable && values && values.length"> </span>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop, Emit} from 'vue-property-decorator'
   import {Tag} from "@/models/problem";
   import {ButtonGroup} from '@/components';
   import {onWheel, randomId} from "@/components/utils";
   import {onSideHover} from "@/components/predictive";

   const scrollLeft = (el: Element, left = 100) => el.scrollBy({
      top: 0,
      left: -left,
      behavior: 'smooth'
   })
   const scrollRight = (el: Element, left = 100) => el.scrollLeft += left

   enum ScroolTo {
      NONE = 'NONE',
      LEFT = 'LEFT',
      RIGHT = 'RIGHT'
   }

   @Component({
      components: {
         ButtonGroup
      }
   })
   export default class Tags extends Vue {

      id = 'tags-' + randomId()

      @Prop({
         type: Array,
         default: []
      }) values: Array<Tag>

      @Prop({
         type: Boolean,
         default: true
      })
      scrollable: boolean

      @Prop({
         type: Array,
         default: []
      })
      activeTags: Array<Tag>

      scrollTo = ScroolTo.NONE

      @Emit('choose')
      chooseTag(tag: Tag) {
         return tag
      }

      isCanAnimateScroll = true

      mounted(){
         const el = document.querySelector(`#${this.id}`)
         if(!el)
            return console.error('Cannot add scrolling')

         onWheel(el, {
            up: () => scrollLeft(el),
            down: () => scrollRight(el)
         })

         const infiniteScroll = () => {
            console.log(this.scrollTo, el.scrollLeft)
            const step = 100
            if(this.scrollTo === ScroolTo.LEFT)
               el.scrollLeft -= step

            if(this.scrollTo === ScroolTo.RIGHT)
               el.scrollLeft += step

            console.log(el.scrollLeft)

            if(this.isCanAnimateScroll)
               setTimeout(infiniteScroll, 100)
         }

         infiniteScroll()

         onSideHover(el, 0.1, {
            left: async () => {
               this.scrollTo = ScroolTo.LEFT
            },
            right: async () => {
               this.scrollTo = ScroolTo.RIGHT
            },
            center: async () => {
               this.scrollTo = ScroolTo.NONE
            }
         })

         el.addEventListener('mouseleave', event => {
            this.scrollTo = ScroolTo.NONE
         })
      }

      beforeDestroy(){
         this.isCanAnimateScroll = false;
      }


   }
</script>

<style scoped lang="scss">
   @import "../../styles/config";
   @import "../../styles/mixins/sidesGradient";

   .tags {
      position: relative;
      margin-top: 0;
      margin-bottom: 3rem;
      min-height: 3rem;
      width: 100%;
      white-space: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: -ms-autohiding-scrollbar;
      scroll-behavior: smooth;

      &--content {
         min-height: 3rem;
      }

      @include sides-gradient(3rem, $background-color, '&--left-gradient', '&--right-gradient');

      &::-webkit-scrollbar {
         display: none;
      }
      
      &--placeholder {
         font-style: italic;
      }
   }
</style>
