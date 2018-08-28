<template>
  <div v-if="!!problemData" class="problem">
    <h1 class="problem--header">{{problemData.name}}</h1>

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

    </div>

    <div class="problem--data">
      <div class="authors">
        <div title="author">
          <i class="material-icons">create</i>
          <span>{{problemData.author}}</span>
        </div>
        <div title="tester">
          <i class="material-icons">how_to_reg</i>
          <span>{{problemData.tester}}</span>
        </div>
      </div>
      <div class="dates">
        <div title="date of upload">
          <i class="material-icons">publish</i>
          <span>{{formatData(problemData.uploadDate)}}</span>
        </div>
        <div title="date of publication">
          <i class="material-icons">public</i>
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
  import {Problem} from "../../state/index"
  import * as actions from '../../store/actionTypes';
  import SourceView from '../../components/SourceView'
  import {IO} from "../../state/problem"

  @Component({
    components: {
      SourceView
    }
  })
  export default class ProblemView extends Vue {
    // @ts-ignore
    @Getter('problems') items: Array<Problem>;

    codeOfProgram = "";

    created() {
      this.$store.dispatch(actions.SET_TEXT_PAGE);
    }

    beforeRouteUpdate(to: any, from: any, next: any){
      // TODO: handle when problem changed
      next();
    }

    get problemData(): Problem | null {
      const items = this.items;
      console.log("Problem items:", items);
      if(!items || !items.length){
        return null;
      }
      console.log("Problem params id", this.$route.params.id);
      return items.filter(p => p.id === this.$route.params.id)[0];
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
      this.$store.dispatch(actions.UPLOAD_CODE, this.codeOfProgram)
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../styles/config";

  .problem {
    &--header {
      color: $headerTextColor;
      margin-bottom: 0.1rem;
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
