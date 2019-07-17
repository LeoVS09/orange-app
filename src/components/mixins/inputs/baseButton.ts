import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component
export default class BaseButton extends Vue {
   @Prop(Number) public tabindex!: number;

   @Prop({
      type: Boolean,
      default: false,
   })
   public disabled!: boolean;

   @Prop(String) public icon!: string;

   @Prop({
      type: Boolean,
      default: false,
   })
   public shadow!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public simple!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public biggerFont!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public active!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public primary!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public maxWidth!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public maxHeight!: boolean;

   @Prop({
      type: Boolean,
      default: true,
   })
   public gradientHighlight!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public borderHighlight!: boolean;

   @Prop({
      type: String,
   })
   public hovered!: string;

   @Prop({
      type: Boolean,
      default: false,
   })
   public fadeText!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public textCanFade!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public circle!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public secondary!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public bold!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public noActiveBold!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public simpleActive!: boolean;

   @Prop({
      type: Boolean,
      default: true,
   })
   public iconLeft!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public contrast!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public textOnHover!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public staticSize!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public onlyIcon!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public ghost!: boolean;

   @Prop({
      type: Boolean,
      default: false,
   })
   public leftAlign!: boolean;

}
