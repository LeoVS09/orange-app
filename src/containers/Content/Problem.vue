<template>
  <div v-if="isLoading" class="skeleton-loading problem-loading"></div>
  <div v-else-if="!!problemData" class="problem">
    <div class="problem--header" v-if="isTeacher">
      <input class="input" type="text" :value="problemData.name" @input="updateName" placeholder="Problem name..."/>
    </div>
    <div v-else v-bind:class="{'problem--header': true, 'done': done}">
      <h1 class="name">{{problemData.name}}</h1>
      <div class="color-line">
        <div class="left-triangle"></div>
        <div class="right-triangle"></div>
        <div class="left-triangle"></div>
        <div class="right-triangle"></div>
        <div class="left-triangle"></div>
        <div class="right-triangle last"></div>
      </div>
      <i class="material-icons icon">done</i>
    </div>
    <p class="problem--tags"><span
      v-for="tag in problemData.tags"
      class="problem--tag-item"
    >{{tag}}</span>
    </p>

    <TextareaAutoresize
      class="problem--description-textarea"
      v-if="isTeacher"
      :value="problemData.text"
      :update="updateText"
      placeholder="Problem description..."></TextareaAutoresize>
    <p v-else class="problem--description">{{problemData.text}}</p>

    <div class="problem--configuration">
      <div class="configuration-line"></div>
      <div class="problem--limits">
        <h4>Limits per test</h4>
        <div class="time">Time: {{formatTime(problemData.limits.time)}}</div>
        <div class="memory">Memory: {{formatBytes(problemData.limits.memory)}}</div>
        <div class="input">Input: {{formatIO(problemData.io.input)}}</div>
        <div class="output">Output: {{formatIO(problemData.io.output)}}</div>
      </div>
    </div>

    <TestView class="problem--example" v-for="example in problemData.examples" :testData="example" />

    <div class="problem--code-upload">
      <textarea placeholder="Paste you code here..." v-model="codeOfProgram"></textarea>

      <div  class="problem--code-button-wrapper">
        <transition name="fade">
          <button v-if="!!codeOfProgram.length" v-on:click="handleUpload">Upload</button>
        </transition>
      </div>

      <div v-if="!!resultRun">
        <p>Is all tests successful {{resultRun.isAllTestsSuccessful}}</p>
        <p>Number test failed {{resultRun.failedTest}}</p>
      </div>
    </div>

    <div class="problem--tests" v-if="isTeacher && problemData.tests">
      <h2>Tests</h2>

      <div v-for="test in problemData.tests">
        <div class="problem--new-test" v-if="!test.id">
          <div class="line"></div>
          <p class="text">New test</p>
        </div>
        <TestView class="problem--test" :testData="test" :editable="true" />
      </div>

    </div>

    <div class="problem--data">
      <div class="authors">
        <div title="author">
          <Icon class="data" type="create" />
          <span>{{problemData.author}}</span>
        </div>
        <div title="tester">
          <Icon class="data" type="how_to_reg" />
          <span>{{problemData.tester}}</span>
        </div>
      </div>
      <div class="dates">
        <div title="date of upload">
          <Icon class="data" type="publish" />
          <span>{{formatData(problemData.uploadDate)}}</span>
        </div>
        <div title="date of publication">
          <Icon class="data" type="public" />
          <span>{{formatData(problemData.publicationDate)}}</span>
        </div>
      </div>
    </div>
    <transition name="sync-fade-up">
      <div class="problem--sync" v-if="!isSynced">
        <Button
          @click.native="syncProblem"
          class="problem--sync-button"
          :disabled="syncing"
          :shadow="true">Synchronize</Button>
      </div>
    </transition>
  </div>

  <h1 v-else>Not have this problem or you can permissions for see it :(</h1>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Watch} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem, ResultRunProgram} from "../../state"
  import * as actions from '../../store/actionTypes';
  import {TestView, Icon, Button, TextareaAutoresize} from '../../components';
  import {IO} from "../../state/problem"

  Component.registerHooks([
    'beforeRouteUpdate'
  ]);

  @Component({
    components: {
      TestView,
      Icon,
      Button,
      TextareaAutoresize
    }
  })
  export default class ProblemView extends Vue {
    // @ts-ignore
    @Getter('currentProblem') problemData?: Problem;
    // @ts-ignore
    @Getter isTeacher: boolean;

    codeOfProgram = "";
    isLoading = false;
    syncing = false;

    @Watch('problemData')
    onProblemDataChanged(data: Problem, oldData: Problem) {

      if(!oldData.synced && data.synced) {
        this.syncing = false;
      }
    }

    created() {
      this.$store.dispatch(actions.SET_TEXT_PAGE);

      this.isLoading = true;
      this.$store.dispatch(actions.SET_CURRENT_PROBLEM, this.$route.params.id)
        .then(() => {
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    }

    beforeRouteUpdate(to: any, from: any, next: any){
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
      if(this.problemData) {
        return this.problemData.resultRun;
      }
      return undefined;
    }

    get done(): boolean {
      if(this.resultRun){
        return this.resultRun.isAllTestsSuccessful
      }
      return false
    }

    get isSynced(): boolean {
      if(this.problemData){
        return this.problemData.synced;
      }
      return true;
    }

    formatData(value: number) {
      const date = new Date(value);
      return date.toLocaleDateString()
    }

    formatIO(value: IO){
      if(value === IO.STANDARD){
        return 'standard'
      }
      return 'file'
    }

    formatBytes(bytes: number, decimals: number = 0) {
      if(bytes == 0) return '0 bytes';
      const k = 1024;
      const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

    formatTime(ms: number, decimals: number = 0) {
      if(ms == 0) return '0 ms';
      const k = 1000;
      const sizes = ['ms', 'seconds'];
      const i = Math.floor(Math.log(ms) / Math.log(k));
      return parseFloat((ms / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

    handleUpload(){
      this.$store.dispatch(actions.UPLOAD_CODE, {id: this.$route.params.id, text: this.codeOfProgram} )
    }

    addTest(){
      this.$store.dispatch(actions.ADD_NEW_TEST);
    }

    updateName(event: any) {
      this.$store.dispatch(actions.EDIT_PROBLEM, {...this.problemData, name: event.target.value})
    }

    updateText(text: string) {
      this.$store.dispatch(actions.EDIT_PROBLEM, {...this.problemData, text})
    }

    syncProblem(){
      if(this.problemData) {
        this.syncing = true;
        this.$store.dispatch(actions.SYNC_PROBLEM, this.problemData.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../styles/config";
  @import "../../styles/skeleton";

  .problem-loading {
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

    &--header {
      display: flex;
      flex-direction: row;
      margin-top: 1.5rem;

      .input {
        font-size: 2rem;
        border: none;
        width: 100%;
        outline: none;
        font-family: Roboto, sans-serif;
        color: $headerTextColor;
      }

      .name {
        color: $headerTextColor;
        margin-bottom: 0;
        margin-top: 0;
        background-color: $backgroundColor;
        padding-right: 1rem;
      }

      .icon {
        display: none;
        background-color: $backgroundColor;
      }

      &.done {
        .text {
          color: $doneColor;
        }

        .icon {
          display: inline-block;
          color: $doneColor;
          top: 0;
          padding-top: 0.1em;
          font-size: 2.4rem;
        }

        $triangle-height: 1.4rem;
        $triangle-weight: 1.5rem;

        .color-line {
          flex: 1;
          background-color: $doneColor;
          display: flex;
          flex-direction: row;
          height: $triangle-height;
          margin-top: 0.6rem;
        }

        .left-triangle, .right-triangle {
          font-size: 0;
          line-height: 0;
          width: 0;

        }

        .left-triangle {
          background-color: $doneColor;
          border-top: $triangle-height solid $backgroundColor;
          border-right: $triangle-weight solid $doneColor;
        }

        .right-triangle {
          background-color: $doneColor;
          border-bottom: $triangle-height solid $backgroundColor;
          border-left: $triangle-weight solid $doneColor;

          &.last {
            margin-left: auto;
          }
        }
      }
    }

    &--tags {
      margin-top: 0;
      margin-bottom: 0;
      color: $secondaryTextColor;
      font-size: 0.8rem;
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: flex-end;
    }

    &--tag-item {
      margin-right: 1em;
    }

    &--description, &--description-textarea {
      padding-bottom: 1rem;
      padding-top: 2rem;
      margin-top: 3rem;
      margin-bottom: 3rem;
      font-size: 1.1rem;
      line-height: 1.7;
    }

    &--description-textarea {

    }

    &--configuration {
      display: flex;
      flex-direction: row;
      width: 100%;
      font-size: 0.9rem;
      margin-bottom: 4.5rem;

      .configuration-line {
        flex: 1;
        border-bottom: 1px solid $secondaryColor;
        margin-top: 4rem;
        height: 50%;
        margin-right: 1rem;
      }
    }

    &--limits {
      h4 {
        margin-top: 0;
        margin-bottom: 0.5rem;
      }

      .memory {
        margin-bottom: 0.5rem;
      }
    }

    &--example, &--test {
      margin-bottom: 2.5rem;
    }

    &--tests {
      display: flex;
      flex-direction: column;

    }

    &--add-test-button {
      display: inline-block;
      width: auto;
      margin-left: auto;
      margin-right: auto;
    }

    &--code-upload {
      textarea {
        width: calc(100% - 4px);
        height: 10rem;
        resize: none;
        border-color: rgb(43, 58, 66);
        border-radius: 3px;
        outline: none;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
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
        background-color: $backgroundColor;
        height: 2rem;
        border: 1px solid $secondaryTextColor;
        margin-top: 1rem;
        margin-bottom: 2rem;
        cursor: pointer;
        outline: none;
        border-radius: 3px;
        position: relative;

        &:hover {
          background-color: $secondaryTextColor;
          color: white;
        }
      }
    }

    &--new-test {
      display: flex;
      flex-direction: row;
      margin-top: -1rem;
      margin-bottom: 0.5rem;

      .line {
        border-bottom: 1px solid $secondaryColor;
        margin-top: auto;
        margin-bottom: auto;
        height: 1px;
        margin-right: 0;
        width: 100%;
        padding-bottom: 0;
        flex: 1;
      }

      .text {
        color: $secondaryTextColor;
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

    .fade-enter-active, .fade-leave-active {
      transition: all 0.3s;
      top: 0;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
      opacity: 0;
      top: -100px;
    }

    .sync-fade-up {
      &-enter-active, &-leave-active {
        transition: all 0.3s;
      }

      &-enter, &-leave-to {
        opacity: 0;
        bottom: -3rem;
      }
    }

    &--data {
      color: $secondaryTextColor;
      font-size: 0.9rem;
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;

    }
  }
</style>
