import Vue from 'vue'
import {Component} from 'vue-property-decorator'

@Component
export default class Focusable extends Vue {
   focused = false

   onFocus(){
      this.focused = true
   }

   onBlur(){
      this.focused = false
   }
}
