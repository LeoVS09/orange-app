import { shallowMount } from '@vue/test-utils'
import Button from '@/components/Button.vue'

describe('Button.vue', () => {
  it('renders slot when passed', () => {
    const msg = 'Click on me'
    const wrapper = shallowMount(Button, {
      slots: { default: msg }
    })
    expect(wrapper.text()).toMatch(msg)
    expect(wrapper.element).toMatchSnapshot()
  })
})
