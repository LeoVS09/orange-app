<template>
  <div class="problems">
    <table class="problems--list">
      <tr class="problems--header">
        <th>Name</th>
        <th>Author</th>
        <th>Upload date</th>
      </tr>
      <tr v-for="item in items">
        <td>{{item.name}}</td>
        <td>{{item.author}}</td>
        <td class="problems--date">{{uploadDateFormat(item.uploadDate)}}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem} from "../../state"

  @Component
  export default class ProblemsList extends Vue {
    // @ts-ignore
    @Getter('openProblems') items: Array<Problem>;

    uploadDateFormat(value: number) {
      const date = new Date(value);
      return date.toLocaleDateString()
    }

  }
</script>

<style lang="scss">
  @import "../../styles/config";

  .problems {
    width: 100%;

    &--list {
      width: 100%;
    }

    tr {
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-bottom: 1rem;

      &.problems--header {
        border-bottom: 1px solid $secondaryColor;
      }

      td, th {
        flex: 1;

        &:first-child {
          flex: 3;
        }
      }
    }

    &--date {
      text-align: center;
    }
  }
</style>
