<template>

   <div
     v-if="$isHaveReadingError(model)"
     class="problem--not-found"
   >
      <div class="not-found--icons">
         <LdrLove width="5rem" height="5rem"/>
         <LdrX width="5rem" height="5rem"/>
         <LdrRobot width="5rem" height="5rem"/>
      </div>

      <h1 class="not-found--text">{{'Sorry, problem not found' | translate}}</h1>
   </div>

   <div
      :key="reactive"
      v-else-if="$isReading(model)"
      class="skeleton-loading problem-loading"
   ></div>

   <div
      v-else
      class="problem"
   >

      <page-header
         :editable="isTeacher"
         v-model="model.name"
         placeholder="Problem name..."
         :colorLine="isDone && 'success'"
         :highlight="false"
         :textWidth="true"
      >
         <template #breadcrumb>
            <breadcrumb :to="{name: ROUTES.PROBLEMS}">{{'Problems' | translate}}</breadcrumb>
         </template>
         {{model.name}}
      </page-header>

<!--      <tags :values="model.tags"></tags>-->

      <text-section
         :editable="isTeacher"
         v-model="model.description"
         placeholder="Problem description..."
      >{{model.description}}</text-section>

      <text-section highlight :textWidth="false">
         <div class="problem--limits">
            <h4 class="problem--limits-header">Limits per test</h4>

            <data-view
               :values="{
                  Time: formatTime(model.limitTime),
                  Memory: formatBytes(model.limitMemory)
               }"
            />

            <data-view
               :values="{
                  Input: formatIO(model.inputType),
                  Output: formatIO(model.outputType)
               }"
            />
         </div>
      </text-section>

      <template v-if="!isTeacher">
         <h4
            class="problem--example-header"
            :key="reactive"
         >{{'Examples' | translate | capitalise}}</h4>

         <TestView
            class="problem--example"
            v-for="(example, i) in model.tests.nodes.filter(t => t.public)"
            :key="'test-' + i + '-' + example.id + '-reactive'"
            :problemId="model.id"
            :testData="example"
         />
      </template>

      <div
         v-if="isTeacher"
         class="problem--tests"
         :key="reactive"
      >
         <h2>Tests</h2>

         <template v-for="test in model.tests.nodes">
            <div
               v-if="!test.id"
               class="problem--new-test"
               :key="test.id"
            >
               <div class="line"></div>
               <p class="text">New test</p>
            </div>
            <TestView
              class="problem--test"
              :testData="test"
              :editable="true"
              :problemId="model.id"
              :key="test.id"
            />
         </template>

      </div>

      <div class="problem--code-upload">
         <textarea-autoresize
            class="problem--code-text"
            placeholder="Paste you code here..."
            v-model="solutionCode"
         />

         <div class="problem--code-button-wrapper">
            <transition name="fade">
               <!-- disabled="model.testingStatus === ProblemTestingStatus.Testing" -->
               <Button
                  v-if="!!solutionCode.length"
                  @click="handleUpload"
                  :disabled="false"
                  :maxWidth="true"
               >Upload</Button>
            </transition>
         </div>

            <!-- TODO: refactor, better to use component-->
            <!-- TODO: use spinner for testing process -->

         <!-- <div class="problem--test-result" v-if="model.testingStatus !== ProblemTestingStatus.NotTested">

            <p class="problem--test-result-testing" v-if="model.testingStatus === ProblemTestingStatus.Testing">Testing...</p>
            <p class="problem--test-result-error" v-if="model.testingStatus === ProblemTestingStatus.Error">Some unexpected error :(</p>
            <p class="problem--test-result-success" v-else-if="model.testingStatus === ProblemTestingStatus.Solved">All tests successful!</p>
            <p class="problem--test-result-error" v-else-if="!resultRun.isCompilationSuccessful">Compilation error</p>
            <p class="problem--test-result-failed" v-else>
               Failed test {{resultRun.failedTest + 1}}
               <span v-if="statusLabel">{{statusLabel}}</span>
            </p>
         </div> -->
      </div>

      <div class="problem--data">
         <div class="authors">
            <div title="author">
               <Icon class="data" type="create"/>
               <span>{{model.author.user.name}}</span>
            </div>
            <div title="tester">
               <Icon class="data" type="how_to_reg"/>
               <span>{{model.tester.user.name}}</span>
            </div>
         </div>
         <div class="dates">
            <div title="date of upload">
               <span>{{formatDate(model.updatedAt)}}</span>
               <Icon class="data" type="publish"/>
            </div>
            <div title="date of publication">
               <span>{{formatDate(model.publicationDate)}}</span>
               <Icon class="data" type="public"/>
            </div>
         </div>
      </div>

      <FloatingButton
         :visible="!$isSynced(model)"
         @click="syncProblem"
         :disabled="model | isPending"
         :primary="true"
         :circle="true"
         :shadow="true"
         :gradientHighlight="false"
         :icon="$isNew(model) ? 'add' : 'autorenew'"
      >{{'save' | translate | capitalise}}
      </FloatingButton>

   </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { FullProblem, ResultRunProgram } from '@/models'
import * as actions from '@/store/actionTypes'
import {
  Button,
  DataView,
  FloatingButton,
  MaterialIcon,
  TextareaAutoresize,
  TextSection
} from '@/components'
import LdrLove from '@/components/icons/LdrLove.vue'
import LdrX from '@/components/icons/LdrX.vue'
import LdrRobot from '@/components/icons/LdrRobot.vue'
import { formatDate } from '@/components/utils'
import {
  PartialProgramInput,
  PartialProgramOutput,
  ProblemError,
  ProblemTestingStatus
} from '@/models/problems'
import { IUploadCodePayload } from '@/store/modules/problems/actions'
import { ROUTES } from '@/router'
import { ModelStatus } from '@/store/modules'
import { ModelReadState } from '@/store/modules/statuses/types'
import { GET_READ_STATE, GET_STATUS } from '@/store/modules/statuses/getters'
import { STATUS_SCOPES } from '@/store/statusScopes'
import { ProblemRepository } from '@/db'
import ReactiveUpdate, { reactiveUpdate } from '@/components/mixins/ReactiveUpdate'
import { TestView, PageHeader, Breadcrumb } from '../containers'
import Tags from '../components/Tags.vue'

const { actionName, MODULES } = actions

// TODO: examples and description on one screen

Component.registerHooks([
  'beforeRouteUpdate'
])

@Component({
  components: {
    TestView,
    Breadcrumb,
    Icon: MaterialIcon,
    Button,
    TextareaAutoresize,
    PageHeader,
    Tags,
    TextSection,
    DataView,
    FloatingButton,
    LdrLove,
    LdrX,
    LdrRobot
  }
})
export default class ProblemView extends Mixins(ReactiveUpdate) {
   @Prop({
     type: String,
     required: true
   })
   public id!: string;

   @Getter public isTeacher?: boolean;

   @Action(actionName(MODULES.PROBLEMS, actions.UPLOAD_CODE))
   public uploadCode!: (payload: IUploadCodePayload) => Promise<void>;

   public solutionCode = '';

   public ROUTES = ROUTES;

   public ProblemStatus = ModelStatus;

   public ProblemTestingStatus = ProblemTestingStatus;

   public ProblemReadState = ModelReadState;

   public resultRun = {} as ResultRunProgram

   get model() {
     return ProblemRepository.findOne(this.id, reactiveUpdate(this))
   }

   // is problem solved by user
   get isDone() {
     return false
   }

   public formatDate(value: Date) {
     return formatDate(value)
   }

   public formatIO(value: PartialProgramInput | PartialProgramOutput) {
     return value.name
   }

   public formatBytes(bytes: number, decimals: number = 0) {
     if (bytes === 0)
       return '0 bytes'
     const k = 1024
     const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
     const i = Math.floor(Math.log(bytes) / Math.log(k))
     return `${parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`
   }

   public formatTime(ms: number, decimals: number = 0) {
     if (ms === 0)
       return '0 ms'
     const k = 1000
     const sizes = ['ms', 'seconds']
     const i = Math.floor(Math.log(ms) / Math.log(k))
     return `${parseFloat((ms / k ** i).toFixed(decimals))} ${sizes[i]}`
   }

   public handleUpload() {
     // TODO: Upload error handle
     if (!this.model)
       return console.error('Cannot upload code without problem data')

     if (!this.solutionCode)
       return console.error('Not have code for uplaoad')

     this.uploadCode({
       problemId: this.model.id,
       text: this.solutionCode
     })
   }

   public syncProblem() {

   }

   get statusLabel(): string | undefined {
     if (!this.resultRun)
       return

     const { status } = this.resultRun
     if (status === 0)
       return

     switch (status) {
       case 1:
         return 'Internal Error'

       case 2:
         return 'Real time limit exceeded'

       case 3:
         return 'Memory limit exceeded'

       case 4:
         return 'CPU limit exceeded'

       default:
         return 'Unexpected error'
     }
   }
}
</script>

<style lang="scss" scoped>
   @import "../styles/config";
   @import "../styles/skeleton";

   .problem-loading {
      width: 100%;
      max-width: $max-text-width;
      margin-left: auto;
      margin-right: auto;

      @include skeleton(10rem, 80rem, (
            (1rem, 2rem, 10rem, 2rem),
            (40rem, 5rem, 15rem, 1rem),
            (1rem, 9rem, 20rem, 1rem),
            (1rem, 11rem, 25rem, 1rem),
            (1rem, 13rem, 30rem, 1rem),
            (20rem, 19rem, 15rem, 1rem),
            (20rem, 21rem, 15rem, 1rem),
            (20rem, 23rem, 15rem, 1rem),
            (20rem, 25rem, 15rem, 1rem),
            (1rem, 29rem, 5rem, 0.8rem),
            (1rem, 30rem, 55rem, 1.5rem),
            (1rem, 33rem, 5rem, 0.8rem),
            (1rem, 34rem, 55rem, 1.5rem),
            (1rem, 41rem, 5rem, 0.8rem),
            (1rem, 42rem, 55rem, 1.5rem),
            (1rem, 45rem, 5rem, 0.8rem),
            (1rem, 46rem, 55rem, 1.5rem)
      ));
   }

   .problem {
      display: flex;
      flex-direction: column;
      align-items: center;

      &--not-found {
         width: 100%;
         height: 100%;
         display: flex;
         min-height: 100%;
         flex-direction: column;
         flex: 1;
         align-items: center;

         .not-found--icons {
            display: flex;
            flex-direction: row;
            margin-top: 20rem;
         }

         .not-found--text {
            margin: auto;
            margin-top: 1rem;
         }
      }

      &--limits {
         width: 100%;
         box-sizing: border-box;
         margin-left: auto;
         margin-right: auto;
         display: flex;
         flex-direction: column;
         align-items: center;

         &-header {
            margin-top: 0;
            text-align: center;
            font-size: 1.1rem;
            margin-bottom: 2rem;
         }
      }

      &--example, &--test {
         margin-bottom: 2.5rem;
         width: 100%;
         max-width: $max-text-width;
      }

      &--test-result {
         font-size: 1.5rem;
         display: flex;
         flex-direction: column;
         align-items: center;

         &-failed {
            color: orange;
         }

         &-success {
            color: green;
         }

         &-error {
            color: red;
         }
      }

      &--tests {
         display: flex;
         flex-direction: column;
         width: 100%;
         align-items: center;

         h2 {
            margin-top: 0;
            padding-top: 0;
         }
      }

      &--add-test-button {
         display: inline-block;
         width: auto;
         margin-left: auto;
         margin-right: auto;
      }

      &--code-upload {
         width: 100%;
         max-width: $max-text-width;
      }

      &--code-text {
         width: calc(100% - 4px);
         resize: none;
         border-radius: 3px;
         border: 1px solid rgb(179, 179, 186);
         outline: none;
         font-family: 'Source Code Pro', monospace;
         z-index: 3;
         position: relative;
      }

      &--code-button-wrapper {
         height: 5rem;
         z-index: 2;
         margin-top: 1rem;

      }

      &--data {
         color: $secondary-text-color;
         font-size: 0.9rem;
         display: flex;
         flex-direction: row;
         width: 100%;
         max-width: $max-text-width;
         justify-content: space-between;

      }

      &--new-test {
         display: flex;
         flex-direction: row;
         margin-top: -1rem;
         margin-bottom: 0.5rem;

         .line {
            border-bottom: 1px solid $secondary-color;
            margin-top: auto;
            margin-bottom: auto;
            height: 1px;
            margin-right: 0;
            width: 100%;
            padding-bottom: 0;
            flex: 1;
         }

         .text {
            color: $secondary-text-color;
            font-size: 0.9rem;
            margin: 0 0.3rem 0 0.3rem;
         }
      }

      .fade {
         &-enter-active, &-leave-active {
            transition: all 0.3s;
            top: 0;
         }

         &-enter, &-leave-to /* .fade-leave-active до версии 2.1.8 */
         {
            opacity: 0;
            top: -100px;
         }
      }

   }
</style>
