<template>
	<div :class="{'select': true, error}" @click="handleClick">

		<span :class="{'visible': !!currentValue.length || isItemsVisible, 'select--placeholder':true}">{{placeholder}}</span>

		<div class="select--input-container">
			<input type="text" :placeholder="placeholder" :value="currentValue" class="select--input" v-bind="options" readonly="readonly"/>
			<div class="select--arrow">
				<span>&#9662;</span>
			</div>
		</div>

		<transition name="fade-items">
			<div v-if="isItemsVisible" class="select--items">
				<div v-for="item in visibleItems" @mousedown="chooseItem(item)" class="select--item">
					<span class="select--item-text">{{item.text}}</span>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
	import Vue from 'vue'
	import {Component, Prop, Watch} from 'vue-property-decorator'

  interface SelectItem {
	   text: string
     value: any
  }

	interface Options {
		tabindex?: number,
		autofocus?: boolean,
		disabled?: boolean
	}

	@Component
	export default class Select extends Vue {
		currentValue = "";

		@Prop({
			type: Array,
			default: []
		})
		items: Array<any>;

		@Prop(String)
		placeholder: string;

		@Prop([String, Number, Boolean, Object])
		value: any;

		@Prop({
			type: String,
			default: "name"
		})
		textField: string;

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

		isItemsVisible: boolean = false;

		get visibleItems(){
			return this.items.map(value => {
				if(typeof value !== 'object'){
					return {text: value, value}
				}

				return {
					text: value[this.textField],
					value
				}
			})
		}

		handleClick(){
			this.isItemsVisible = !this.isItemsVisible
		}

		chooseItem(item: SelectItem){
			this.currentValue = item.text;
			this.$emit('input', item.value)
		}

		@Watch('value')
		updateValue(value: any){
			if(typeof value !== 'object') {
				this.currentValue = value;
			}

			this.currentValue = value[this.textField]
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

	$input-padding-top: 0.5rem;
	$container-padding-top: 0;

	.select {
		width: 100%;
		max-width: $input-width;
		display: flex;
		flex-direction: column;
		justify-content: left;
		margin-top: 1rem;
		position: relative;
		padding-top: $container-padding-top;

		&--input {
			z-index: 3;
			outline: none;
			margin-top: 0;
			padding: $input-padding-top 0.2rem;
			border: none;
			border-bottom: 1px solid $border-line-color;
			width: 100%;
			font-size: $font-size-input-primary;
			line-height: $font-line-height-input-primary;

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

		&--items {
			position: absolute;
			cursor: pointer;
			top: $font-line-height-input-primary + ($input-padding-top * 2) + $container-padding-top;
		}

		&.error {
			.select--input {
				border-bottom-color: $input-error-color;
			}
		}

		.fade-items {
			&-active, &-active {
				transition: opacity .2s;
			}

			&-enter, &-leave-to {
				opacity: 0;
			}
		}
	}
</style>
