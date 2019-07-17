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
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import {Action, Getter} from 'vuex-class';
import {MaterialIcon, SourceView} from '@/components';
import * as actions from '@/store/actionTypes';
import {Test} from '@/models';
import {MODULES, actionName} from '@/store/actionTypes';
import {IUpdateTestActionPayload} from '@/store/modules/problems/actions';
import {GET_READ_STATE, GET_STATUS} from '@/store/modules/statuses/getters';
import {ModelStatus} from '@/store/modules';
import {ModelReadState} from '@/store/modules/statuses/types';
import {STATUS_SCOPES} from '@/store/statusScopes';

@Component({
   components: {
      SourceView,
      Icon: MaterialIcon,
   },
})
export default class TestView extends Vue {

   @Prop({
      type: Object,
      required: true,
   })
   public testData!: Test;

   @Prop({
      type: Boolean,
      default: false,
   })
   public editable!: boolean;

   @Getter(GET_STATUS)
   public getStatus!: (scope: string, id: string) => ModelStatus;

   @Getter(GET_READ_STATE)
   public getRead!: (scope: string, id: string) => ModelReadState;

   @Action(actionName(MODULES.PROBLEMS, actions.EDIT_TEST)) public editTest!: (test: Test) => void;
   @Action(actionName(MODULES.PROBLEMS, actions.UPDATE_TEST)) public updateTest!: (payload: IUpdateTestActionPayload) => boolean;

   get isEdited() {
      return this.getStatus(STATUS_SCOPES.TESTS, this.testData.id) === ModelStatus.Changed;
   }

   get isTestCorect() {
      const test = this.testData;
      return test.input.length && test.output.length;
   }

   get isSyncing() {
      if (this.isEdited) {
         return false;
      }

      const status = this.getStatus(STATUS_SCOPES.TESTS, this.testData.id);

      return status === ModelStatus.Creating || status === ModelStatus.Updating;
   }

   public updateInput(input: string) {
      this.editTest({
         ...this.testData,
         input,
      });
   }

   public updateOutput(output: string) {
      this.editTest({
         ...this.testData,
         output,
      });
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
