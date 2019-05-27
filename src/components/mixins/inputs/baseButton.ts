import Vue from 'vue'
import {Component, Prop} from 'vue-property-decorator'

@Component
export default class BaseButton extends Vue {
   @Prop(Number) tabindex: number;

   @Prop({
      type: Boolean,
      default: false
   })
   disabled: boolean;

   @Prop(String) icon: string;

   @Prop({
      type: Boolean,
      default: false
   })
   shadow: boolean;

   @Prop({
      type: Boolean,
      default: false
   })
   simple: boolean;

   @Prop({
      type: Boolean,
      default: false
   })
   biggerFont: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   active: boolean;

   @Prop({
      type: Boolean,
      default: false
   })
   primary: boolean;

   @Prop({
      type: Boolean,
      default: false
   })
   maxWidth: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   maxHeight: boolean

   @Prop({
      type: Boolean,
      default: true
   })
   gradientHighlight: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   borderHighlight: boolean

   @Prop({
      type: String
   })
   hovered: string

   @Prop({
      type: Boolean,
      default: false
   })
   fadeText: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   textCanFade: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   circle: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   secondary: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   bold: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   noActiveBold: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   simpleActive: boolean

   @Prop({
      type: Boolean,
      default: true
   })
   iconLeft: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   contrast: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   textOnHover: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   staticSize: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   onlyIcon: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   ghost: boolean

   @Prop({
      type: Boolean,
      default: false
   })
   leftAlign: boolean

}
