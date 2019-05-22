import {TestStatus} from "@/models";
import {TestStatus} from "@/models";
import {TestStatus} from "@/models";
<template>
   <div :class="{test: true, syncing: isSyncing}">
      <h4>Input
         <Icon type="autorenew" v-if="isSyncing" class="test--status-icon"/>
         <Icon type="create" v-else-if="isEdited" class="test--status-icon"/>
      </h4>
      <source-view :text="testData.input" @input="updateInput" :editable="editable"></source-view>
      <h4>Output</h4>
      <source-view :text="testData.output" @input="updateOutput" :editable="editable"></source-view>
   </div>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Prop} from 'vue-property-decorator'
   import {Action} from 'vuex-class'
   import {Icon, SourceView} from '@/components';
   import * as actions from '@/store/actionTypes';
   import {Test, TestStatus} from "@/models";
   import {IEditTestPayload} from "@/store/modules/problems/mutations";
   import {IUpdateTestActionPayload} from "@/store/modules/problems/actions/tests";

   const MIN_TIME_SYNC = 1500; // ms

   @Component({
      components: {
         SourceView,
         Icon
      }
   })
   export default class TestView extends Vue {

      @Prop({
         type: String,
         required: true
      })
      problemId: string

      @Prop({
         type: Object,
         required: true
      })
      testData: Test

      @Prop({
         type: Boolean,
         default: false
      })
      editable: boolean

      lastInput = Date.now();
      syncId: any = 0;

      @Action(actions.EDIT_TEST) editTest: (payload: IEditTestPayload) => void
      @Action(actions.UPDATE_TEST) updateTest: (payload: IUpdateTestActionPayload) => boolean

      get isEdited(){
         return this.testData.status === TestStatus.Changed
      }

      get isTestCorect(){
         const test = this.testData
         return test.input.length && test.output.length
      }
      sync() {
         if (this.syncId)
            clearTimeout(this.syncId)

         if(!this.isTestCorect)
            return

         this.syncId = setTimeout(() => {
            if (!this.isTestCorect || !(Date.now() - this.lastInput > MIN_TIME_SYNC))
               return

            this.updateTest({
               problemId: this.problemId,
               testId: this.testData.id
            })

         }, MIN_TIME_SYNC + 5)
      }

      get isSyncing() {
         if (this.isEdited)
            return false;

         return this.testData.status === TestStatus.Creating || this.testData.status === TestStatus.Updating
      }

      updateInput(input: string) {
         this.editTest({
            problemId: this.problemId,
            test: {
               ...this.testData,
               input
            }
         })
         this.sync();
      }

      updateOutput(output: string) {
         this.editTest({
            problemId: this.problemId,
            test: {
               ...this.testData,
               output
            }
         })
         this.sync();
      }
   }
</script>

<style scoped lang="scss">
   @import "../../styles/config";

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
         .test--status-icon {
            // TODO: fix animation rotation, may be use another icon
            animation: spin 1s linear infinite;
         }
      }

      @keyframes spin {
         100% {
            transform: rotate(360deg);
         }
      }
   }
</style>
