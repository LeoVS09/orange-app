<template>
   <div
      :class="{tags: true, 'scrollable-horizontal': scrollable}"
   >
      <div class="tags--separator" v-if="values"><span> </span></div>
      <span class="tags--left-gradient" v-if="scrollable && values"> </span>
      <div ref="tags" class="tags--content-wrapper" >
         <ButtonGroup
            class="tags--content"
            v-if="values"
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
      </div>
      <span class="tags--right-gradient" v-if="scrollable && values && values.length"> </span>
   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  Component,
  Prop,
  Emit,
  Mixins
} from 'vue-property-decorator'
import { ButtonGroup } from '@/components/index'
import { onWheel, randomId } from '@/components/utils'
import { onSideHover } from '@/components/predictive'
import Loadable from '@/components/mixins/loadable'

export interface BaseTag {
   name: string;
}

const scrollLeft = (el: Element, left = 100) => el.scrollBy({
  top: 0,
  left: -left,
  behavior: 'smooth'
})
const scrollRight = (el: Element, left = 100) => el.scrollLeft += left

enum ScrollTo {
   NONE = 'NONE',
   LEFT = 'LEFT',
   RIGHT = 'RIGHT',
}

@Component({
  components: {
    ButtonGroup
  }
})
export default class Tags extends Mixins(Loadable) {

   @Prop({
     type: Array
   }) public values!: BaseTag[];

   @Prop({
     type: Boolean,
     default: true
   })
   public scrollable!: boolean;

   @Prop({
     type: Array,
     default: () => []
   })
   public activeTags!: BaseTag[];

   public scrollTo = ScrollTo.NONE;

   public isCanAnimateScroll = true;

   @Emit('choose')
   public chooseTag(tag: BaseTag) {
     return tag
   }

   public mounted() {
     const el = this.$refs.tags as Element | null
     if (!el)
       return console.error('Cannot add scrolling')

     onWheel(el, {
       up: () => scrollLeft(el),
       down: () => scrollRight(el)
     })

     const infiniteScroll = () => {
       const step = 100
       if (this.scrollTo === ScrollTo.LEFT)
         el.scrollLeft -= step

       if (this.scrollTo === ScrollTo.RIGHT)
         el.scrollLeft += step

       if (this.isCanAnimateScroll)
         setTimeout(infiniteScroll, 100)
     }

     infiniteScroll()

     onSideHover(el, 0.1, {
       left: async () => {
         this.scrollTo = ScrollTo.LEFT
       },
       right: async () => {
         this.scrollTo = ScrollTo.RIGHT
       },
       center: async () => {
         this.scrollTo = ScrollTo.NONE
       }
     })

     el.addEventListener('mouseleave', event => {
       this.scrollTo = ScrollTo.NONE
     })
   }

   public beforeDestroy() {
     this.isCanAnimateScroll = false
   }
}
</script>

<style scoped lang="scss">
   @import "../styles/config";
   @import "../styles/mixins/sidesGradient";

   .tags {
      position: relative;
      margin-top: 0;
      margin-bottom: 3rem;
      min-height: 2rem;
      width: 100%;

      &--content-wrapper {
         position: relative;
         width: 100%;
         white-space: nowrap;
         overflow-x: auto;
         -webkit-overflow-scrolling: touch;
         -ms-overflow-style: -ms-autohiding-scrollbar;
         scroll-behavior: smooth;

         &::-webkit-scrollbar {
            display: none;
         }
      }

      &--content {
         min-height: 2rem;
      }

      @include sides-gradient(3rem, $background-color, '&--left-gradient', '&--right-gradient');

      &--separator {
         position: absolute;
         bottom: 0;
         display: flex;
         flex-direction: column;
         align-items: center;
         width: 100%;

         span {
            width: 100%;
            max-width: calc(#{$max-content-width} - #{2*$content-padding-sides});
            box-sizing: border-box;
            margin: 0 auto;
            height: 1px;
            background: linear-gradient(to right, transparent 0%, $divider-line-color 15%, $divider-line-color 85%, transparent 100%);
         }
      }

      &--placeholder {
         font-style: italic;
      }
   }
</style>
