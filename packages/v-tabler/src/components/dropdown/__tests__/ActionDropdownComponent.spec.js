import { mount } from '@vue/test-utils'
import { describe, it, beforeEach, expect } from 'vitest'
import { ActionDropdownComponent } from '@/components/dropdown'
import { CardComponent } from '@/components/card'

describe('ActionDropdownComponent', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(ActionDropdownComponent, {
            props: {
                options: ['Action 1', 'Action 2', 'Action 3']
            },
            attachTo: document.body
        })
    })

    it('renders the dropdown with the correct number of actions', async () => {
        const contentWrapper = wrapper.getComponent(CardComponent)
        expect(contentWrapper.exists()).toBe(true)
        expect(contentWrapper.isVisible()).toBe(false)
        await wrapper.trigger('click')
        expect(contentWrapper.exists()).toBe(true)
        const actionItems = contentWrapper.findAll('li[role=menuitem]')
        expect(actionItems.length).toBe(3)
    })

    it('emits the correct event when an action is clicked', async () => {
        const contentWrapper = wrapper.getComponent(CardComponent)
        const actionItems = contentWrapper.findAll('li[role=menuitem]')
        await actionItems[1].trigger('click')

        expect(wrapper.emitted('on-select')).toBeTruthy()
        expect(wrapper.emitted('on-select')[0]).toEqual(['Action 2'])
        expect(contentWrapper.isVisible()).toBe(false)
    })

    it('allows controlling open state via instance methods', async () => {
        expect(wrapper.vm.show).toBe(false)
        wrapper.vm.toggleDropdown()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.show).toBe(true)
        wrapper.vm.toggleDropdown()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.show).toBe(false)
        wrapper.vm.toggleDropdown()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.show).toBe(true)
        wrapper.vm.closeDropdown()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.show).toBe(false)
    })
})
