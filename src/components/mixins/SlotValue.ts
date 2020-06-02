import Vue from 'vue'
import { Component, Prop, Mixins } from 'vue-property-decorator'

@Component
export default class SlotValue extends Vue {

  public slotValue(): string | null {
    const slot = this.$slots.default && this.$slots.default[0]

    if (!slot)
      return null

    const { text } = slot
    if (!text)
      return null

    return text
  }
}
