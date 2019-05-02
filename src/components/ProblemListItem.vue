<template>
  <tr class="problem"
      :style="{ background: backgroundData}"
      @mousemove="gradientCircleAtMouse"
      @mouseleave="transparentBackground"
      @mouseover="gradientCircleAtMouse"

  >
    <td>{{item.name}}</td>
    <td class="problem--author">{{item.author}}</td>
    <td class="problem--date">{{uploadDateFormat(item.updatedAt ? item.updatedAt : item.createdAt)}}</td>
  </tr>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {formatDate} from "./utils";

  @Component({
    props: {
      item: Object
    }
  })
  export default class ProblemListItem extends Vue{

    backgroundData = 'transparent';

    gradientCircleAtMouse(event: MouseEvent){
      let x = event.clientX;
      let y = event.clientY;
      // @ts-ignore
      const box = event.currentTarget.getBoundingClientRect();

      let positionX = x - box.left;
      let positionY = y - box.top;
      this.backgroundData = `radial-gradient(circle at ${positionX}px ${positionY}px, rgb(255, 75, 117) 0%, #FD7501 40%, #FD9624 100%)`
    }

    transparentBackground(){
      this.backgroundData = 'transparent';
    }

    uploadDateFormat(value: Date) {
      return formatDate(value)
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .problem {
     width: 100%;
     display: flex;
     flex-direction: row;
     padding-bottom: $problem-line-padding;
     padding-top: $problem-line-padding;
     transition: box-shadow 0.2s cubic-bezier(.25,.8,.25,1);
     border-bottom: 1px solid $secondary-color;


    &:hover {
       box-shadow: 0 0 5px rgba(0,0,0,0.3);
       cursor: pointer;
       color: white;

     }

    td, th {
      flex: 1;

    &:first-child {
       flex: 3;
       padding-left: 1rem;
       text-underline: $main-text-color;
     }
    }

    &--author {
      text-align: center;
    }

    &--date {
      text-align: center;
    }
  }
</style>
