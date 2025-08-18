import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { DropdownComponent } from '@/components/dropdown'
import { CardComponent } from '@/components/card'

describe('DropdownComponent', () => {
    let wrapper

    beforeEach(async () => {
        wrapper = mount(DropdownComponent, {
            props: {
                options: ['Option 1', 'Option 2', 'Option 3'],
                modelValue: 'Option 1'
            }
        })
        await wrapper.vm.$nextTick()
    })

    it('renders the dropdown button with the correct label', () => {
        const button = wrapper.find('.dropdown-button')
        expect(button.exists()).toBe(true)
        expect(button.text()).toContain('Option 1')
    })

    it('toggles the dropdown visibility when the button is clicked', async () => {
        const button = wrapper.find('.dropdown-button')
        expect(wrapper.vm.show).toBe(false)

        await button.trigger('click')
        expect(wrapper.vm.show).toBe(true)

        await button.trigger('click')
        expect(wrapper.vm.show).toBe(false)
    })

    it('renders the correct number of options', async () => {
        await wrapper.setData({ show: true })
        const contentWrapper = wrapper.getComponent(CardComponent)
        const options = contentWrapper.findAll('li')
        expect(options.length).toBe(3)
    })

    it('emits update:modelValue when an option is clicked', async () => {
        await wrapper.setData({ show: true })

        const contentWrapper = wrapper.getComponent(CardComponent)
        const options = contentWrapper.findAll('li')

        await options[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Option 2'])
    })

    it('applies the active class to the selected option', async () => {
        await wrapper.setData({ show: true })

        const contentWrapper = wrapper.getComponent(CardComponent)
        const options = contentWrapper.findAll('li')

        expect(options[0].attributes('data-selected')).toBe('true')
        expect(options[1].attributes('data-selected')).toBe('false')
    })

    it('closes the dropdown when clicking outside', async () => {
        const clickOutsideDirective = wrapper.vm.$options.directives.clickOutside
        expect(clickOutsideDirective).toBeDefined()

        wrapper.vm.show = true
        document.body.click() // Simulate a click outside
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.show).toBe(false)
    })
})
