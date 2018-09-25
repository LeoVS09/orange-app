<template>
  <div :class="{test: true, syncing: isSyncing}">
    <h4>Input <Icon type="cached" v-if="isSyncing" class="test--status-icon"/><Icon type="create" v-if="isEdited" class="test--status-icon"/></h4>
    <source-view :text="testData.input" :update="updateInput" :editable="editable"></source-view>
    <h4>Output</h4>
    <source-view :text="testData.output" :update="updateOutput" :editable="editable"></source-view>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import SourceView from './SourceView.vue';
  import Icon from './Icon.vue';
  import * as actions from '../store/actionTypes';

  const MIN_TIME_SYNC = 1500; // ms

  @Component({
    props: {
      testData: {
        type: Object,
        required: true
      },
      editable: Boolean
    },
    components: {
      SourceView,
      Icon
    }
  })
  export default class TestView extends Vue {

    lastInput = Date.now();
    syncId = 0;
    isEdited = false;

    sync(){
      if(this.syncId){
        clearTimeout(this.syncId)
      }

      this.isEdited = true;

      this.syncId = setTimeout(() => {
        // @ts-ignore
        let data = this.testData;
        console.log("test syncing", data.input.length, data.output.length, (Date.now() - this.lastInput > MIN_TIME_SYNC));
        if (!!data.input.length && !!data.output.length && (Date.now() - this.lastInput > MIN_TIME_SYNC)) {
          this.isEdited = false;
          this.$store.dispatch(actions.SYNC_TEST, data)
        }
      }, MIN_TIME_SYNC + 5)
    }

    updateInput(input: string){
      // @ts-ignore
      this.$store.dispatch(actions.EDIT_TEST, {...this.testData, input });
      this.sync();
    }

    updateOutput(output: string){
      // @ts-ignore
      this.$store.dispatch(actions.EDIT_TEST, {...this.testData, output });
      this.sync();
    }

    get isSyncing(){
      if(this.isEdited){
        return false;
      }
      // @ts-ignore
      return !!this.testData.input.length && !!this.testData.output.length && !this.testData.synced
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config";

  .test {
    h4 {
      margin-top: 0.3rem;
      margin-bottom: 0.1rem;
      display: flex;
      flex-direction: row;
      height: 1.3rem;
    }

    &--status-icon {
      font-size: 1.3rem;
      color: green;
      margin-left: auto;
      top: 0;
    }

    &.syncing {

    }
  }
</style>
