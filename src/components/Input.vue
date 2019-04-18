<template>
    <div :class="{'input-container': true, error}">
      <span :class="{'visible': !!currentValue.length, 'input-container--placeholder':true}">{{placeholder}}</span>
      <input :type="type" :placeholder="placeholder" :value="currentValue" @input="inputValue" class="input-container--input" v-bind="options"/>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Component, Prop, Watch} from 'vue-property-decorator'

  interface Options {
    tabindex?: number,
    autofocus?: boolean,
    disabled?: boolean
  }

  @Component
  export default class Input extends Vue {
		currentValue = "";

    @Prop(String)
		type: string;

		@Prop(String)
		placeholder: string;

		@Prop(String)
		value: string;

		@Prop(Number)
		tabindex: number;

		@Prop(Boolean)
		autofocus: boolean;

		@Prop({
			type: Boolean,
			default: false
		})
		error: boolean;

		@Prop(Boolean)
		disabled: boolean;

    inputValue(event: any){
      if(event.target.value.length) {
        this.error = false;
      }
      const value = event.target.value;

      this.currentValue = value;

      this.$emit('update:error', this.error);
      this.$emit('input', value)
    }

		@Watch('value')
		updateValue(value: string){
    	this.currentValue = value;
		}

    get options(): Options {
      let result = {} as Options;

      if(this.tabindex) {
        result['tabindex'] = this.tabindex;
      }

      if(this.autofocus){
        result['autofocus'] = true;
      }

      if(this.disabled){
        result['disabled'] = true;
      }

      return result;
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/config.scss";

  .input-container {
    width: 100%;
    max-width: $input-width;
    display: flex;
    flex-direction: column;
    justify-content: left;
    margin-top: 1rem;

    &--input {
      z-index: 3;
      outline: none;
      margin-top: 0;
      padding: 0.5rem 0.2rem;
      border: none;
      border-bottom: 1px solid $border-line-color;
      width: 100%;

      &:active, &:focus {
        border-bottom-color: $input-color;
      }
    }

    &--placeholder {
      z-index: 2;
      font-size: 0.7rem;
      color: rgba(0, 0, 0, 0.65);
      opacity: 0;
      position: relative;
      bottom: -1rem;
      transition-property: all;
      transition-duration: 0.3s;

      &.visible {
        opacity: 1;
        bottom: 0;
      }
    }

    &.error {
      .input-container--input {
        border-bottom-color: $input-error-color;
      }
    }
  }
</style>
