import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component
export default class Focusable extends Vue {
   public focused = false;

   public onFocus() {
      this.focused = true;
   }

   public onBlur() {
      this.focused = false;
   }
}
