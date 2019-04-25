<template>
   <div v-if="isLoading" class="skeleton-loading problem-loading"></div>
   <div v-else-if="!!problemData" class="problem">

      <page-header
         :editable="isTeacher"
         :value="problemData.name"
         @input="updateName"
         placeholder="Problem name..."
         :colorLine="done && 'success'"
         :highlight="false"
         :textWidth="true"
      >{{problemData.name}}</page-header>

      <tags :values="problemData.tags" ></tags>

      <page-section
         :editable="isTeacher"
         :value="problemData.description"
         :input="updateText"
         placeholder="Problem description..."
      >{{problemData.description}}</page-section>

      <page-section highlight :textWidth="false">
         <div class="problem--limits">
            <h4 class="problem--limits-header">Limits per test</h4>

            <data-view
               :values="{
                  Time: formatTime(problemData.limits.time),
                  Memory: formatBytes(problemData.limits.memory)
               }"
            />

            <data-view
               :values="{
                  Input: formatIO(problemData.io.input),
                  Output: formatIO(problemData.io.output)
               }"
            />
         </div>
      </page-section>

      <h4 v-if="!isTeacher" class="problem--example-header" >Examples</h4>

      <TestView v-if="!isTeacher" class="problem--example" v-for="(example, i) in problemData.examples"
                :key="'test-' + i + '-' + example.id" :testData="example" />

      <div class="problem--code-upload" v-if="!isTeacher">
         <textarea placeholder="Paste you code here..." v-model="codeOfProgram"></textarea>

         <div class="problem--code-button-wrapper">
            <transition name="fade">
               <button v-if="!!codeOfProgram.length" v-on:click="handleUpload">Upload</button>
            </transition>
         </div>

         <div class="problem--test-result" v-if="!!resultRun">
            <p class="success" v-if="resultRun.isAllTestsSuccessful">All tests successful!</p>
            <p class="failed" v-else>Failed test {{resultRun.failedTest}}</p>
         </div>
      </div>

      <div class="problem--tests" v-if="isTeacher && problemData.tests">
         <h2>Tests</h2>

         <template v-for="test in problemData.tests">
            <div class="problem--new-test" v-if="!test.id">
               <div class="line"></div>
               <p class="text">New test</p>
            </div>
            <TestView class="problem--test" :testData="test" :editable="true"/>
         </template>

      </div>

      <div class="problem--data">
         <div class="authors">
            <div title="author">
               <Icon class="data" type="create"/>
               <span>{{problemData.author}}</span>
            </div>
            <div title="tester">
               <Icon class="data" type="how_to_reg"/>
               <span>{{problemData.tester}}</span>
            </div>
         </div>
         <div class="dates">
            <div title="date of upload">
               <Icon class="data" type="publish"/>
               <span>{{formatData(problemData.uploadDate)}}</span>
            </div>
            <div title="date of publication">
               <Icon class="data" type="public"/>
               <span>{{formatData(problemData.publicationDate)}}</span>
            </div>
         </div>
      </div>

      <transition name="button-fade-up">
         <div class="problem--sync" v-if="!isSynced">
            <Button
               :click="syncProblem"
               class="problem--sync-button"
               :disabled="syncing"
               :shadow="true">{{isCreate ? 'Create' : 'Synchronize'}}
            </Button>
         </div>
      </transition>
   </div>

   <h1 v-else>Not have this problem or you can permissions for see it :(</h1>
</template>

<script lang="ts">
   import Vue from 'vue'
   import {Component, Watch, Prop} from 'vue-property-decorator'
   import {Getter} from 'vuex-class'
   import {Problem, ResultRunProgram} from "@/state"
   import * as actions from '@/store/actionTypes';
   import {
      TestView,
      Icon,
      Button,
      TextareaAutoresize,
      PageHeader,
      Tags,
      PageSection,
      DataView
   } from '@/components';
   import {ProgramInput, ProgramOutput, Tag} from "@/state/problem"
   // TODO: examples and description on one screen

   Component.registerHooks([
      'beforeRouteUpdate'
   ]);

   @Component({
      components: {
         TestView,
         Icon,
         Button,
         TextareaAutoresize,
         PageHeader,
         Tags,
         PageSection,
         DataView
      }
   })
   export default class ProblemView extends Vue {

      @Prop(Boolean) isCreate?: boolean;

      @Getter('currentProblem') problemData?: Problem;

      @Getter isTeacher?: boolean;

      codeOfProgram = "";
      isLoading = false;
      syncing = false;

      @Watch('problemData')
      onProblemDataChanged(data: Problem, oldData: Problem) {

         if ((!!oldData && !!data) && (!oldData.synced && data.synced)) {
            this.syncing = false;
         }
      }

      created() {
         if (this.isCreate) {
            this.isLoading = false;
            this.$store.dispatch(actions.START_CREATE_PROBLEM)
            return;
         }
         this.isLoading = true;
         this.$store.dispatch(actions.SET_CURRENT_PROBLEM, this.$route.params.id)
            .then(() => {
               this.isLoading = false;
            })
            .catch(() => {
               this.isLoading = false;
            });
      }

      beforeRouteUpdate(to: any, from: any, next: any) {
         console.log("before route update id: ", to.params.id);
         this.isLoading = true;
         this.$store.dispatch(actions.SET_CURRENT_PROBLEM, to.params.id)
            .then(() => {
               this.isLoading = false;
               next();
            })
            .catch(e => {
               this.isLoading = false;
               next(e);
            });
      }

      get resultRun(): ResultRunProgram | undefined {
         if (this.problemData) {
            return this.problemData.resultRun;
         }
         return undefined;
      }

      get done(): boolean {
         if (this.resultRun) {
            return this.resultRun.isAllTestsSuccessful
         }
         return false
      }

      get isSynced(): boolean {
         if (this.problemData) {
            return this.problemData.synced;
         }
         return true;
      }

      formatData(value: number) {
         const date = new Date(value);
         return date.toLocaleDateString()
      }

      formatIO(value: ProgramInput | ProgramOutput) {
         return value.name
      }

      formatBytes(bytes: number, decimals: number = 0) {
         if (bytes == 0) return '0 bytes';
         const k = 1024;
         const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
         const i = Math.floor(Math.log(bytes) / Math.log(k));
         return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
      }

      formatTime(ms: number, decimals: number = 0) {
         if (ms == 0) return '0 ms';
         const k = 1000;
         const sizes = ['ms', 'seconds'];
         const i = Math.floor(Math.log(ms) / Math.log(k));
         return parseFloat((ms / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
      }

      handleUpload() {
         this.$store.dispatch(actions.UPLOAD_CODE, {id: this.$route.params.id, text: this.codeOfProgram})
      }

      addTest() {
         this.$store.dispatch(actions.ADD_NEW_TEST);
      }

      updateName(event: any) {
         this.$store.dispatch(actions.EDIT_PROBLEM, {...this.problemData, name: event.target.value})
      }

      updateText(event: any) {
         this.$store.dispatch(actions.EDIT_PROBLEM, {...this.problemData, text: event.target.value})
      }

      syncProblem() {
         if (this.problemData) {

            if (this.isCreate) {
               if (!this.problemData.name.length) {
                  console.error("Not have name");
                  return;
               }
               if (!this.problemData.description.length) {
                  console.error("Not have text");
                  return;
               }
               if (!this.problemData.tests || !this.problemData.tests.length) {
                  console.error("Unexpected situation in tests");
                  return;
               }
               if (!this.problemData.tests[0].id.length) {
                  console.error("Not have tests");
                  return;
               }
               this.syncing = true;
               this.$store.dispatch(actions.CREATE_PROBLEM, this.problemData)
                  .then(({ok, id}) => {
                     this.syncing = false;
                     if (ok) {
                        this.$router.push({path: `/problem/${id}`})
                     }
                  });
               return;
            }
            this.$store.dispatch(actions.SYNC_PROBLEM, this.problemData.id);
         }
      }
   }
</script>

<style lang="scss" scoped>
   @import "../../styles/config";
   @import "../../styles/skeleton";

   .problem-loading {
      width: 100%;
      max-width: $max-text-width;
      margin-left: auto;
      margin-right: auto;

      @include skeleton(60rem, 80rem, (
            (1rem, 2rem, 10rem, 2rem),
            (40rem, 3rem, 15rem, 1rem),
            (1rem, 9rem, 20rem, 1rem),
            (1rem, 11rem, 25rem, 1rem),
            (1rem, 13rem, 30rem, 1rem),
            (49rem, 19rem, 6rem, 1rem),
            (49rem, 21rem, 6rem, 1rem),
            (49rem, 23rem, 4rem, 1rem),
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

      &--limits {
         width: 100%;
         max-width: 20rem;
         box-sizing: border-box;
         margin-left: auto;
         margin-right: auto;

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

         .failed {
            color: orange;
         }

         .success {
            color: green;
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
         textarea {
            width: calc(100% - 4px);
            height: 10rem;
            resize: none;
            border-color: rgb(43, 58, 66);
            border-radius: 3px;
            outline: none;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 3;
            position: relative;
         }
      }

      &--code-button-wrapper {
         height: 5rem;
         z-index: 2;

         button {
            width: 100%;
            font-family: "Roboto", sans-serif;
            background-color: $background-color;
            height: 2rem;
            border: 1px solid $secondary-text-color;
            margin-top: 1rem;
            margin-bottom: 2rem;
            cursor: pointer;
            outline: none;
            border-radius: 3px;
            position: relative;

            &:hover {
               background-color: $secondary-text-color;
               color: white;
            }
         }
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

      &--sync {
         position: fixed;
         right: 3rem;
         bottom: 3rem;
         z-index: 6;
         width: 15rem;
         display: flex;
         flex-direction: row;

         &-button {
            margin-left: auto;
            margin-right: auto;
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

      .button-fade-up {
         &-enter-active, &-leave-active {
            transition: all 0.3s;
         }

         &-enter, &-leave-to {
            opacity: 0;
            bottom: -3rem;
         }
      }


   }
</style>
