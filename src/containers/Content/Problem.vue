<template>
  <div v-if="isLoading" class="skeleton-loading"></div>
  <div v-else-if="!!problemData" class="problem">
    <div v-bind:class="{'problem--header': true, 'done': done}">
      <h1 class="text">{{problemData.name}}</h1>
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

    <p class="problem--description">{{problemData.text}}</p>

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
    <div v-for="example in problemData.examples" class="problem--example">
      <h4>Input</h4>
      <source-view :text="example.input"></source-view>
      <h4>Output</h4>
      <source-view :text="example.output"></source-view>
    </div>

    <div class="problem--code-upload">
      <textarea placeholder="Paste you code her..." v-model="codeOfProgram"></textarea>

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

    <div class="problem--data">
      <div class="authors">
        <div title="author">
          <i class="material-icons data">create</i>
          <span>{{problemData.author}}</span>
        </div>
        <div title="tester">
          <i class="material-icons data">how_to_reg</i>
          <span>{{problemData.tester}}</span>
        </div>
      </div>
      <div class="dates">
        <div title="date of upload">
          <i class="material-icons data">publish</i>
          <span>{{formatData(problemData.uploadDate)}}</span>
        </div>
        <div title="date of publication">
          <i class="material-icons data">public</i>
          <span>{{formatData(problemData.publicationDate)}}</span>
        </div>
      </div>
    </div>


  </div>
  <h1 v-else>Not have this problem :(</h1>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component} from 'vue-property-decorator'
  import {Getter} from 'vuex-class'
  import {Problem, ResultRunProgram} from "../../state/index"
  import * as actions from '../../store/actionTypes';
  import SourceView from '../../components/SourceView'
  import {IO} from "../../state/problem"

  Component.registerHooks([
    'beforeRouteUpdate'
  ]);

  @Component({
    components: {
      SourceView
    }
  })
  export default class ProblemView extends Vue {
    // @ts-ignore
    @Getter('currentProblem') problemData?: Problem;

    codeOfProgram = "";
    isLoading = false;

    created() {
      this.$store.dispatch(actions.SET_TEXT_PAGE);

      this.isLoading = true;
      this.$store.dispatch(actions.SET_CURRRENT_PROBLEM, this.$route.params.id)
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
      this.$store.dispatch(actions.SET_CURRRENT_PROBLEM, to.params.id)
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

  }
</script>

<style lang="scss" scoped>
  @import "../../styles/config";

  $skeletonColor: #D3D3D3;
  $skeletonAnimationTime: 1.5s;
  $skeletonAnimationLightenColorValue: 20%;
  .skeleton-loading {
    width: 100%;
    height: 80rem;

    &:empty::after {
      content:"";
      display:block;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;


      background-image:
        linear-gradient(
            90deg,
            rgba(lighten($skeletonColor, $skeletonAnimationLightenColorValue), 0) 0,
            rgba(lighten($skeletonColor, $skeletonAnimationLightenColorValue), .8) 50%,
            rgba(lighten($skeletonColor, $skeletonAnimationLightenColorValue), 0) 100%
        ),
        linear-gradient($skeletonColor 2rem, transparent 0),
        linear-gradient($skeletonColor 0.6rem, transparent 0),
        linear-gradient($skeletonColor 1rem, transparent 0),
        linear-gradient($skeletonColor 1rem, transparent 0),
        linear-gradient($skeletonColor 1rem, transparent 0),
        linear-gradient($skeletonColor 0.6rem, transparent 0),
        linear-gradient($skeletonColor 0.6rem, transparent 0),
        linear-gradient($skeletonColor 0.6rem, transparent 0),
        linear-gradient($skeletonColor 0.8rem, transparent 0),
        linear-gradient($skeletonColor 1.5rem, transparent 0),
        linear-gradient($skeletonColor 0.8rem, transparent 0),
        linear-gradient($skeletonColor 1.5rem, transparent 0),
        linear-gradient($skeletonColor 0.8rem, transparent 0),
        linear-gradient($skeletonColor 1.5rem, transparent 0),
        linear-gradient($skeletonColor 0.8rem, transparent 0),
        linear-gradient($skeletonColor 1.5rem, transparent 0);
      background-size:
        50rem 80rem,
        10rem 2rem,
        15rem 1rem,
        20rem 1rem,
        25rem 1rem,
        30rem 1rem,
        6rem 1rem,
        6rem 1rem,
        4rem 1rem,
        5rem 1rem,
        45rem 1.5rem,
        5rem 0.8rem,
        45rem 1.5rem,
        5rem 0.8rem,
        45rem 1.5rem,
        5rem 0.8rem,
        45rem 1.5rem;

      $headerPosition: 1rem 1rem;
      $tagsPosition: 30rem 3rem;
      $descriptionFirstPosition: 1rem 6rem;
      $descriptionSecondPosition: 1rem 8rem;
      $descriptionThirdPosition: 1rem 10rem;
      $configurationFirstPosition: 39rem 14rem;
      $configurationSecondPosition: 39rem 16rem;
      $configurationThirdPosition: 39rem 18rem;
      $exampleInputTextFirstPosition: 1rem 24rem;
      $exampleInputFirstPosition: 1rem 25rem;
      $exampleOutputTextFirstPosition: 1rem 28rem;
      $exampleOutputFirstPosition: 1rem 29rem;
      $exampleInputTextSecondPosition: 1rem 36rem;
      $exampleInputSecondPosition: 1rem 37rem;
      $exampleOutputTextSecondPosition: 1rem 40rem;
      $exampleOutputSecondPosition: 1rem 41rem;

      background-position:
        600% 0,
        $headerPosition,
        $tagsPosition,
        $descriptionFirstPosition,
        $descriptionSecondPosition,
        $descriptionThirdPosition,
        $configurationFirstPosition,
        $configurationSecondPosition,
        $configurationThirdPosition,
        $exampleInputTextFirstPosition,
        $exampleInputFirstPosition,
        $exampleOutputTextFirstPosition,
        $exampleOutputFirstPosition,
        $exampleInputTextSecondPosition,
        $exampleInputSecondPosition,
        $exampleOutputTextSecondPosition,
        $exampleOutputSecondPosition;

      animation: loading $skeletonAnimationTime infinite;

      @keyframes loading {
        to {
          background-position: -600% 0,
          $headerPosition,
          $tagsPosition,
          $descriptionFirstPosition,
          $descriptionSecondPosition,
          $descriptionThirdPosition,
          $configurationFirstPosition,
          $configurationSecondPosition,
          $configurationThirdPosition,
          $exampleInputTextFirstPosition,
          $exampleInputFirstPosition,
          $exampleOutputTextFirstPosition,
          $exampleOutputFirstPosition,
          $exampleInputTextSecondPosition,
          $exampleInputSecondPosition,
          $exampleOutputTextSecondPosition,
          $exampleOutputSecondPosition;
        }
      }
    }
  }

  .problem {

    &--header {
      display: flex;
      flex-direction: row;

      .text {
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

    &--description {
      padding-bottom: 1rem;
      padding-top: 2rem;
      margin-top: 0;
      margin-bottom: 0;
    }

    &--configuration {
      display: flex;
      flex-direction: row;
      width: 100%;
      font-size: 0.9rem;
      margin-bottom: 2.5rem;

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



    &--example {
      margin-bottom: 2.5rem;

      h4 {
        margin-top: 0.3rem;
        margin-bottom: 0.1rem;
      }
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

    .fade-enter-active, .fade-leave-active {
      transition: all 0.3s;
      top: 0;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
      opacity: 0;
      top: -100px;
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
